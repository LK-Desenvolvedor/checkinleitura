const Group = require('../models/Group');
const User = require('../models/User');
const Invitation = require('../models/Invitation');

exports.createGroup = async (req, res) => {
  try {
    const { name, description } = req.body;

    if (!name) {
      return res.status(400).json({ message: 'Nome do grupo é obrigatório' });
    }

    const newGroup = new Group({
      name,
      description,
      creator: req.userId,
      members: [{
        userId: req.userId,
        role: 'creator'
      }]
    });

    await newGroup.save();
    await newGroup.populate('creator members.userId');

    res.status(201).json({
      message: 'Grupo criado com sucesso',
      group: newGroup
    });
  } catch (error) {
    console.error('Erro ao criar grupo:', error);
    res.status(500).json({ message: 'Erro ao criar grupo' });
  }
};

exports.getMyGroups = async (req, res) => {
  try {
    const groups = await Group.find({
      'members.userId': req.userId
    }).populate('creator members.userId');

    res.status(200).json(groups);
  } catch (error) {
    console.error('Erro ao buscar grupos:', error);
    res.status(500).json({ message: 'Erro ao buscar grupos' });
  }
};

exports.getGroupById = async (req, res) => {
  try {
    const group = await Group.findById(req.params.groupId)
      .populate('creator members.userId');

    if (!group) {
      return res.status(404).json({ message: 'Grupo não encontrado' });
    }

    res.status(200).json(group);
  } catch (error) {
    console.error('Erro ao buscar grupo:', error);
    res.status(500).json({ message: 'Erro ao buscar grupo' });
  }
};

exports.updateGroup = async (req, res) => {
  try {
    const { name, description } = req.body;
    const group = await Group.findById(req.params.groupId);

    if (!group) {
      return res.status(404).json({ message: 'Grupo não encontrado' });
    }

    const userMember = group.members.find(m => m.userId.toString() === req.userId);
    if (!userMember || !['creator', 'creator_promoted', 'admin'].includes(userMember.role)) {
      return res.status(403).json({ message: 'Sem permissão para atualizar grupo' });
    }

    group.name = name || group.name;
    group.description = description || group.description;
    group.updatedAt = Date.now();
    await group.save();
    await group.populate('creator members.userId');

    res.status(200).json({
      message: 'Grupo atualizado com sucesso',
      group
    });
  } catch (error) {
    console.error('Erro ao atualizar grupo:', error);
    res.status(500).json({ message: 'Erro ao atualizar grupo' });
  }
};

exports.inviteUserToGroup = async (req, res) => {
  try {
    const { groupId, userId } = req.body;

    const group = await Group.findById(groupId);
    if (!group) {
      return res.status(404).json({ message: 'Grupo não encontrado' });
    }

    const userMember = group.members.find(m => m.userId.toString() === req.userId);
    if (!userMember || !['creator', 'creator_promoted', 'admin'].includes(userMember.role)) {
      return res.status(403).json({ message: 'Sem permissão para convidar' });
    }

    const invitedUser = await User.findById(userId);
    if (!invitedUser) {
      return res.status(404).json({ message: 'Usuário não encontrado' });
    }

    const existingInvitation = await Invitation.findOne({
      groupId,
      invitedUserId: userId,
      type: 'group',
      status: 'pending'
    });

    if (existingInvitation) {
      return res.status(400).json({ message: 'Convite já existe' });
    }

    const invitation = new Invitation({
      groupId,
      invitedUserId: userId,
      invitedBy: req.userId,
      type: 'group'
    });

    await invitation.save();
    await invitation.populate('groupId invitedUserId invitedBy');

    res.status(201).json({
      message: 'Convite enviado com sucesso',
      invitation
    });
  } catch (error) {
    console.error('Erro ao convidar usuário:', error);
    res.status(500).json({ message: 'Erro ao convidar usuário' });
  }
};

exports.respondToInvitation = async (req, res) => {
  try {
    const { invitationId, response } = req.body;

    if (!['accepted', 'rejected'].includes(response)) {
      return res.status(400).json({ message: 'Resposta inválida' });
    }

    const invitation = await Invitation.findById(invitationId);
    if (!invitation) {
      return res.status(404).json({ message: 'Convite não encontrado' });
    }

    if (invitation.invitedUserId.toString() !== req.userId) {
      return res.status(403).json({ message: 'Sem permissão' });
    }

    invitation.status = response;
    await invitation.save();

    if (response === 'accepted' && invitation.type === 'group') {
      const group = await Group.findById(invitation.groupId);
      group.members.push({
        userId: req.userId,
        role: 'member'
      });
      await group.save();
    }

    res.status(200).json({
      message: `Convite ${response} com sucesso`,
      invitation
    });
  } catch (error) {
    console.error('Erro ao responder convite:', error);
    res.status(500).json({ message: 'Erro ao responder convite' });
  }
};

exports.removeMemberFromGroup = async (req, res) => {
  try {
    const { groupId, memberId } = req.body;

    const group = await Group.findById(groupId);
    if (!group) {
      return res.status(404).json({ message: 'Grupo não encontrado' });
    }

    const userMember = group.members.find(m => m.userId.toString() === req.userId);
    if (!userMember || !['creator', 'creator_promoted', 'admin'].includes(userMember.role)) {
      return res.status(403).json({ message: 'Sem permissão para remover membro' });
    }

    group.members = group.members.filter(m => m.userId.toString() !== memberId);
    await group.save();
    await group.populate('creator members.userId');

    res.status(200).json({
      message: 'Membro removido com sucesso',
      group
    });
  } catch (error) {
    console.error('Erro ao remover membro:', error);
    res.status(500).json({ message: 'Erro ao remover membro' });
  }
};

exports.banMemberFromGroup = async (req, res) => {
  try {
    const { groupId, memberId, banDays } = req.body;

    const group = await Group.findById(groupId);
    if (!group) {
      return res.status(404).json({ message: 'Grupo não encontrado' });
    }

    const userMember = group.members.find(m => m.userId.toString() === req.userId);
    if (!userMember || !['creator', 'creator_promoted', 'admin'].includes(userMember.role)) {
      return res.status(403).json({ message: 'Sem permissão para banir membro' });
    }

    const memberToban = group.members.find(m => m.userId.toString() === memberId);
    if (!memberToban) {
      return res.status(404).json({ message: 'Membro não encontrado' });
    }

    const banUntil = new Date();
    banUntil.setDate(banUntil.getDate() + (banDays || 7));
    memberToban.bannedUntil = banUntil;

    await group.save();
    await group.populate('creator members.userId');

    res.status(200).json({
      message: 'Membro banido com sucesso',
      group
    });
  } catch (error) {
    console.error('Erro ao banir membro:', error);
    res.status(500).json({ message: 'Erro ao banir membro' });
  }
};

exports.promoteToAdmin = async (req, res) => {
  try {
    const { groupId, memberId } = req.body;

    const group = await Group.findById(groupId);
    if (!group) {
      return res.status(404).json({ message: 'Grupo não encontrado' });
    }

    const userMember = group.members.find(m => m.userId.toString() === req.userId);
    if (!userMember || !['creator', 'creator_promoted'].includes(userMember.role)) {
      return res.status(403).json({ message: 'Sem permissão para promover' });
    }

    const memberToPromote = group.members.find(m => m.userId.toString() === memberId);
    if (!memberToPromote) {
      return res.status(404).json({ message: 'Membro não encontrado' });
    }

    memberToPromote.role = 'admin';
    await group.save();
    await group.populate('creator members.userId');

    res.status(200).json({
      message: 'Membro promovido a admin com sucesso',
      group
    });
  } catch (error) {
    console.error('Erro ao promover membro:', error);
    res.status(500).json({ message: 'Erro ao promover membro' });
  }
};

exports.promoteToCreator = async (req, res) => {
  try {
    const { groupId, memberId } = req.body;

    const group = await Group.findById(groupId);
    if (!group) {
      return res.status(404).json({ message: 'Grupo não encontrado' });
    }

    const userMember = group.members.find(m => m.userId.toString() === req.userId);
    if (userMember.role !== 'creator') {
      return res.status(403).json({ message: 'Apenas criador pode promover a criador' });
    }

    const memberToPromote = group.members.find(m => m.userId.toString() === memberId);
    if (!memberToPromote) {
      return res.status(404).json({ message: 'Membro não encontrado' });
    }

    memberToPromote.role = 'creator_promoted';
    await group.save();
    await group.populate('creator members.userId');

    res.status(200).json({
      message: 'Membro promovido a criador com sucesso',
      group
    });
  } catch (error) {
    console.error('Erro ao promover membro a criador:', error);
    res.status(500).json({ message: 'Erro ao promover membro a criador' });
  }
};
