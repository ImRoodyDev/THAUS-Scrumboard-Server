// Express Js
const express = require('express');
const applicationRoutes = express.Router();

// Middleware for routes
const { NoAuthentication, Authentication } = require('../middlewares/authentication');

// Routes handling for express application
const Register = require('./auth/register.route'); // ✅
const Login = require('./auth/login.route'); // ✅

const AddMessage = require('./chat/add-message.route'); // ✅
const GetMessages = require('./chat/get-message.route'); // ✅

const AddEpic = require('./epic/add-epic.route'); // ✅
const DeleteEpic = require('./epic/delete-epic.route'); // ✅

const AddFeature = require('./feature/add-feature.route'); // ✅
const DeleteFeature = require('./feature/delete-feature.route'); // ✅

const AddMember = require('./group/add-member.route'); // ✅
const CreateGroup = require('./group/create-group.route'); // ✅
const DeleteGroup = require('./group/delete-group.route'); // ✅
const RemoveMember = require('./group/remove-member.route'); // ✅
const GetGroups = require('./group/get-groups.route'); // ✅
const GetGroup = require('./group/get-group.route'); // ✅

const AddSprint = require('./sprint/add-sprint.route'); // ✅
const DeleteSprint = require('./sprint/delete-sprint.route'); // ✅
const LinkStory = require('./sprint/link-story.route'); // ✅
const StartSprint = require('./sprint/start-sprint.route'); // ✅
const StoryStatus = require('./sprint/story-status.route'); // ✅
const UnlinkStory = require('./sprint/unlink-story.route'); // ✅

const AddStory = require('./story/add-story.route'); // ✅
const DeleteStory = require('./story/delete-story.route'); // ✅

applicationRoutes.use('/login', NoAuthentication, Login);
applicationRoutes.use('/register', NoAuthentication, Register);

applicationRoutes.use('/chat/add-message', Authentication, AddMessage);
applicationRoutes.use('/chat/get-messages', Authentication, GetMessages);

applicationRoutes.use('/epic/add-epic', Authentication, AddEpic);
applicationRoutes.use('/epic/delete-epic', Authentication, DeleteEpic);

applicationRoutes.use('/feature/add-feature', Authentication, AddFeature);
applicationRoutes.use('/feature/delete-feature', Authentication, DeleteFeature);

applicationRoutes.use('/group/add-member', Authentication, AddMember);
applicationRoutes.use('/group/create-group', Authentication, CreateGroup);
applicationRoutes.use('/group/delete-group', Authentication, DeleteGroup);
applicationRoutes.use('/group/remove-member', Authentication, RemoveMember);
applicationRoutes.use('/group/get-groups', Authentication, GetGroups);
applicationRoutes.use('/group/get-group', Authentication, GetGroup); // ✅

applicationRoutes.use('/sprint/add-sprint', Authentication, AddSprint);
applicationRoutes.use('/sprint/delete-sprint', Authentication, DeleteSprint);
applicationRoutes.use('/sprint/link-story', Authentication, LinkStory);
applicationRoutes.use('/sprint/start-sprint', Authentication, StartSprint);
applicationRoutes.use('/sprint/story-status', Authentication, StoryStatus);
applicationRoutes.use('/sprint/unlink-story', Authentication, UnlinkStory);

applicationRoutes.use('/story/add-story', Authentication, AddStory);
applicationRoutes.use('/story/delete-story', Authentication, DeleteStory);

// Exporting the application routes
module.exports = { applicationRoutes };
