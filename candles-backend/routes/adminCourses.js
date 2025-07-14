  const express = require('express');
  const router = express.Router();
  const Course = require('../models/course');
  const mongoose = require('mongoose');

  // Middleware to check admin
  const requireAdmin = (req, res, next) => {
    // For example, you can check req.user.role === 'Admin'
    // Add your authentication & authorization logic here
    next();
  };

  // GET all courses
  router.get('/', async (req, res) => {
    try {
      const courses = await Course.find();
      res.json(courses);
    } catch (err) {
      res.status(500).json({ error: 'Failed to fetch courses' });
    }
  });


  // CREATE a new course
  router.post('/', requireAdmin, async (req, res) => {
    try {
      const { title, description, instructor, totalModules, completedModules, thumbnail, videos } = req.body;
      const course = new Course({
        
        title,
        description,
        instructor,
        totalModules,
        completedModules,
        thumbnail,
        videos: Array.isArray(videos) ? videos : []
      });
      await course.save();
      res.status(201).json(course);
    } catch (err) {
      console.error('Create course error:', err);
      res.status(400).json({ error: err.message });
    }
  });
  // UPDATE a course
  router.put('/:id', requireAdmin, async (req, res) => {
    try {
      const courseId = req.params.id;
      if (!mongoose.Types.ObjectId.isValid(courseId)) {
        return res.status(400).json({ error: "Invalid or missing Course ID" });
      }

      const { title, description, videos,thumbnail } = req.body;
      const updateObj = {};
      if (title !== undefined) updateObj.title = title;
      if (description !== undefined) updateObj.description = description;
      if (videos !== undefined) updateObj.videos = videos;
      if(thumbnail !== undefined) updateObj.thumbnail = thumbnail;

      const updated = await Course.findByIdAndUpdate(
        courseId,
        updateObj,
        { new: true, runValidators: true }
      );

      if (!updated) return res.status(404).json({ error: 'Course not found' });
      res.json(updated);
    } catch (err) {
      res.status(400).json({ error: err.message || 'Failed to update course' });
    }
  });


  // DELETE a course
  router.delete('/:id', requireAdmin, async (req, res) => {
    try {
      const deleted = await Course.findByIdAndDelete(req.params.id);
      if (!deleted) return res.status(404).json({ error: 'Course not found' });
      res.json({ message: 'Course deleted', _id: req.params.id });
    } catch (err) {
      res.status(400).json({ error: 'Failed to delete course' });
    }
  });

  module.exports = router;