const Project = require('../models/Project');
const Group = require('../models/Group');
const Invitation = require('../models/Invitation');

exports.createProject = async (req, res) => {
  try {
    const { groupId, name, author, coverImage, description, deadline } = req.body;

    if (!groupId || !name || !author) {
      return res.status(400).json({ message: 'Grupo, nome do livro e autor são obrigatórios' });
    }

    const group = await Group.findById(groupId);
    if (!group) {
      return res.status(404).json({ message: 'Grupo não encontrado' });
    }

    const userMember = group.members.find(m => m.userId.toString() === req.userId);
    if (!userMember || !['creator', 'creator_promoted', 'admin'].includes(userMember.role)) {
      return res.status(403).json({ message: 'Sem permissão para criar projeto' });
    }

    const newProject = new Project({
      groupId,
      name,
      author,
      coverImage,
      description,
      createdBy: req.userId,
      deadline: deadline ? new Date(deadline) : null,
      participants: group.members.map(m => ({
        userId: m.userId,
        status: 'pending'
      }))
    });

    await newProject.save();
    await newProject.populate('createdBy groupId participants.userId');

    for (const member of group.members) {
      if (member.userId.toString() !== req.userId) {
        const invitation = new Invitation({
          groupId,
          projectId: newProject._id,
          invitedUserId: member.userId,
          invitedBy: req.userId,
          type: 'project'
        });
        await invitation.save();
      }
    }

    res.status(201).json({
      message: 'Projeto criado com sucesso',
      project: newProject
    });
  } catch (error) {
    console.error('Erro ao criar projeto:', error);
    res.status(500).json({ message: 'Erro ao criar projeto' });
  }
};

exports.getProjectsByGroup = async (req, res) => {
  try {
    const { groupId } = req.params;

    const projects = await Project.find({ groupId })
      .populate('createdBy groupId participants.userId');

    res.status(200).json(projects);
  } catch (error) {
    console.error('Erro ao buscar projetos:', error);
    res.status(500).json({ message: 'Erro ao buscar projetos' });
  }
};

exports.getProjectById = async (req, res) => {
  try {
    const project = await Project.findById(req.params.projectId)
      .populate('createdBy groupId participants.userId');

    if (!project) {
      return res.status(404).json({ message: 'Projeto não encontrado' });
    }

    res.status(200).json(project);
  } catch (error) {
    console.error('Erro ao buscar projeto:', error);
    res.status(500).json({ message: 'Erro ao buscar projeto' });
  }
};

exports.updateProject = async (req, res) => {
  try {
    const { name, author, coverImage, description, deadline } = req.body;
    const project = await Project.findById(req.params.projectId);

    if (!project) {
      return res.status(404).json({ message: 'Projeto não encontrado' });
    }

    const group = await Group.findById(project.groupId);
    const userMember = group.members.find(m => m.userId.toString() === req.userId);

    if (!userMember || !['creator', 'creator_promoted', 'admin'].includes(userMember.role)) {
      return res.status(403).json({ message: 'Sem permissão para atualizar projeto' });
    }

    project.name = name || project.name;
    project.author = author || project.author;
    project.coverImage = coverImage || project.coverImage;
    project.description = description || project.description;
    project.deadline = deadline ? new Date(deadline) : project.deadline;
    project.updatedAt = Date.now();

    await project.save();
    await project.populate('createdBy groupId participants.userId');

    res.status(200).json({
      message: 'Projeto atualizado com sucesso',
      project
    });
  } catch (error) {
    console.error('Erro ao atualizar projeto:', error);
    res.status(500).json({ message: 'Erro ao atualizar projeto' });
  }
};

exports.pauseProject = async (req, res) => {
  try {
    const project = await Project.findById(req.params.projectId);

    if (!project) {
      return res.status(404).json({ message: 'Projeto não encontrado' });
    }

    const group = await Group.findById(project.groupId);
    const userMember = group.members.find(m => m.userId.toString() === req.userId);

    if (!userMember || !['creator', 'creator_promoted', 'admin'].includes(userMember.role)) {
      return res.status(403).json({ message: 'Sem permissão para pausar projeto' });
    }

    project.status = 'paused';
    await project.save();
    await project.populate('createdBy groupId participants.userId');

    res.status(200).json({
      message: 'Projeto pausado com sucesso',
      project
    });
  } catch (error) {
    console.error('Erro ao pausar projeto:', error);
    res.status(500).json({ message: 'Erro ao pausar projeto' });
  }
};

exports.reopenProject = async (req, res) => {
  try {
    const project = await Project.findById(req.params.projectId);

    if (!project) {
      return res.status(404).json({ message: 'Projeto não encontrado' });
    }

    const group = await Group.findById(project.groupId);
    const userMember = group.members.find(m => m.userId.toString() === req.userId);

    if (!userMember || !['creator', 'creator_promoted', 'admin'].includes(userMember.role)) {
      return res.status(403).json({ message: 'Sem permissão para reabrir projeto' });
    }

    project.status = 'active';
    await project.save();
    await project.populate('createdBy groupId participants.userId');

    res.status(200).json({
      message: 'Projeto reaberto com sucesso',
      project
    });
  } catch (error) {
    console.error('Erro ao reabrir projeto:', error);
    res.status(500).json({ message: 'Erro ao reabrir projeto' });
  }
};

exports.deleteProject = async (req, res) => {
  try {
    const project = await Project.findById(req.params.projectId);

    if (!project) {
      return res.status(404).json({ message: 'Projeto não encontrado' });
    }

    const group = await Group.findById(project.groupId);
    const userMember = group.members.find(m => m.userId.toString() === req.userId);

    if (!userMember || !['creator', 'creator_promoted', 'admin'].includes(userMember.role)) {
      return res.status(403).json({ message: 'Sem permissão para deletar projeto' });
    }

    await Project.findByIdAndDelete(req.params.projectId);

    res.status(200).json({ message: 'Projeto deletado com sucesso' });
  } catch (error) {
    console.error('Erro ao deletar projeto:', error);
    res.status(500).json({ message: 'Erro ao deletar projeto' });
  }
};

exports.respondToProjectInvitation = async (req, res) => {
  try {
    const { projectId, response } = req.body;

    if (!['accepted', 'rejected'].includes(response)) {
      return res.status(400).json({ message: 'Resposta inválida' });
    }

    const project = await Project.findById(projectId);
    if (!project) {
      return res.status(404).json({ message: 'Projeto não encontrado' });
    }

    const participant = project.participants.find(p => p.userId.toString() === req.userId);
    if (!participant) {
      return res.status(404).json({ message: 'Você não foi convidado para este projeto' });
    }

    participant.status = response;
    if (response === 'accepted') {
      participant.joinedAt = new Date();
    }

    await project.save();
    await project.populate('createdBy groupId participants.userId');

    res.status(200).json({
      message: `Convite do projeto ${response} com sucesso`,
      project
    });
  } catch (error) {
    console.error('Erro ao responder convite do projeto:', error);
    res.status(500).json({ message: 'Erro ao responder convite do projeto' });
  }
};

exports.removeParticipantFromProject = async (req, res) => {
  try {
    const { projectId, participantId } = req.body;

    const project = await Project.findById(projectId);
    if (!project) {
      return res.status(404).json({ message: 'Projeto não encontrado' });
    }

    const group = await Group.findById(project.groupId);
    const userMember = group.members.find(m => m.userId.toString() === req.userId);

    if (!userMember || !['creator', 'creator_promoted', 'admin'].includes(userMember.role)) {
      return res.status(403).json({ message: 'Sem permissão para remover participante' });
    }

    project.participants = project.participants.filter(p => p.userId.toString() !== participantId);
    await project.save();
    await project.populate('createdBy groupId participants.userId');

    res.status(200).json({
      message: 'Participante removido com sucesso',
      project
    });
  } catch (error) {
    console.error('Erro ao remover participante:', error);
    res.status(500).json({ message: 'Erro ao remover participante' });
  }
};

exports.banParticipantFromProject = async (req, res) => {
  try {
    const { projectId, participantId, banDays } = req.body;

    const project = await Project.findById(projectId);
    if (!project) {
      return res.status(404).json({ message: 'Projeto não encontrado' });
    }

    const group = await Group.findById(project.groupId);
    const userMember = group.members.find(m => m.userId.toString() === req.userId);

    if (!userMember || !['creator', 'creator_promoted', 'admin'].includes(userMember.role)) {
      return res.status(403).json({ message: 'Sem permissão para banir participante' });
    }

    const participant = project.participants.find(p => p.userId.toString() === participantId);
    if (!participant) {
      return res.status(404).json({ message: 'Participante não encontrado' });
    }

    const banUntil = new Date();
    banUntil.setDate(banUntil.getDate() + (banDays || 7));
    participant.bannedUntil = banUntil;

    await project.save();
    await project.populate('createdBy groupId participants.userId');

    res.status(200).json({
      message: 'Participante banido com sucesso',
      project
    });
  } catch (error) {
    console.error('Erro ao banir participante:', error);
    res.status(500).json({ message: 'Erro ao banir participante' });
  }
};
