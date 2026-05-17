const CheckIn = require('../models/CheckIn');
const Project = require('../models/Project');

exports.createCheckIn = async (req, res) => {
  try {
    const { projectId, photo, comment, chapter, page } = req.body;

    if (!projectId) {
      return res.status(400).json({ message: 'ID do projeto é obrigatório' });
    }

    const project = await Project.findById(projectId);
    if (!project) {
      return res.status(404).json({ message: 'Projeto não encontrado' });
    }

    const participant = project.participants.find(p => p.userId.toString() === req.userId);
    if (!participant || participant.status !== 'accepted') {
      return res.status(403).json({ message: 'Você não está participando deste projeto' });
    }

    const newCheckIn = new CheckIn({
      projectId,
      userId: req.userId,
      photo,
      comment,
      chapter: chapter || null,
      page: page || null
    });

    await newCheckIn.save();
    await newCheckIn.populate('userId projectId');

    res.status(201).json({
      message: 'Check-in registrado com sucesso',
      checkIn: newCheckIn
    });
  } catch (error) {
    console.error('Erro ao criar check-in:', error);
    res.status(500).json({ message: 'Erro ao criar check-in' });
  }
};

exports.getCheckInsByProject = async (req, res) => {
  try {
    const { projectId } = req.params;

    const checkIns = await CheckIn.find({ projectId })
      .populate('userId projectId')
      .sort({ createdAt: -1 });

    res.status(200).json(checkIns);
  } catch (error) {
    console.error('Erro ao buscar check-ins:', error);
    res.status(500).json({ message: 'Erro ao buscar check-ins' });
  }
};

exports.getCheckInsByUser = async (req, res) => {
  try {
    const { projectId } = req.params;

    const checkIns = await CheckIn.find({
      projectId,
      userId: req.userId
    }).populate('userId projectId')
      .sort({ createdAt: -1 });

    res.status(200).json(checkIns);
  } catch (error) {
    console.error('Erro ao buscar check-ins do usuário:', error);
    res.status(500).json({ message: 'Erro ao buscar check-ins do usuário' });
  }
};

exports.getCheckInById = async (req, res) => {
  try {
    const checkIn = await CheckIn.findById(req.params.checkInId)
      .populate('userId projectId');

    if (!checkIn) {
      return res.status(404).json({ message: 'Check-in não encontrado' });
    }

    res.status(200).json(checkIn);
  } catch (error) {
    console.error('Erro ao buscar check-in:', error);
    res.status(500).json({ message: 'Erro ao buscar check-in' });
  }
};

exports.updateCheckIn = async (req, res) => {
  try {
    const { photo, comment, chapter, page } = req.body;
    const checkIn = await CheckIn.findById(req.params.checkInId);

    if (!checkIn) {
      return res.status(404).json({ message: 'Check-in não encontrado' });
    }

    if (checkIn.userId.toString() !== req.userId) {
      return res.status(403).json({ message: 'Sem permissão para editar este check-in' });
    }

    checkIn.photo = photo || checkIn.photo;
    checkIn.comment = comment || checkIn.comment;
    checkIn.chapter = chapter !== undefined ? chapter : checkIn.chapter;
    checkIn.page = page !== undefined ? page : checkIn.page;

    await checkIn.save();
    await checkIn.populate('userId projectId');

    res.status(200).json({
      message: 'Check-in atualizado com sucesso',
      checkIn
    });
  } catch (error) {
    console.error('Erro ao atualizar check-in:', error);
    res.status(500).json({ message: 'Erro ao atualizar check-in' });
  }
};

exports.deleteCheckIn = async (req, res) => {
  try {
    const checkIn = await CheckIn.findById(req.params.checkInId);

    if (!checkIn) {
      return res.status(404).json({ message: 'Check-in não encontrado' });
    }

    if (checkIn.userId.toString() !== req.userId) {
      return res.status(403).json({ message: 'Sem permissão para deletar este check-in' });
    }

    await CheckIn.findByIdAndDelete(req.params.checkInId);

    res.status(200).json({ message: 'Check-in deletado com sucesso' });
  } catch (error) {
    console.error('Erro ao deletar check-in:', error);
    res.status(500).json({ message: 'Erro ao deletar check-in' });
  }
};

exports.getProjectProgress = async (req, res) => {
  try {
    const { projectId } = req.params;

    const project = await Project.findById(projectId).populate('participants.userId');
    if (!project) {
      return res.status(404).json({ message: 'Projeto não encontrado' });
    }

    const progress = [];

    for (const participant of project.participants) {
      if (participant.status === 'accepted') {
        const checkIns = await CheckIn.find({
          projectId,
          userId: participant.userId._id
        }).sort({ createdAt: -1 });

        progress.push({
          userId: participant.userId._id,
          userName: participant.userId.name,
          userAvatar: participant.userId.avatar,
          checkInCount: checkIns.length,
          lastCheckIn: checkIns.length > 0 ? checkIns[0].createdAt : null,
          checkIns
        });
      }
    }

    res.status(200).json(progress);
  } catch (error) {
    console.error('Erro ao buscar progresso do projeto:', error);
    res.status(500).json({ message: 'Erro ao buscar progresso do projeto' });
  }
};
