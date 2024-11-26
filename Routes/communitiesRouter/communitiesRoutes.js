const express = require("express");
const { getCommunities, addCommunities, updateCommunities, deletecommunities, getCommunitiesId } = require ("../../Controllers/communitites");

const communitiesRoutes = express.Router();

communitiesRoutes.post("/communities", addCommunities);
communitiesRoutes.get("/communities", getCommunities);
communitiesRoutes.put("/communities/:id", updateCommunities);
communitiesRoutes.delete("/communities/:id", deletecommunities);
communitiesRoutes.get("/communities/:id", getCommunitiesId);

module.exports = communitiesRoutes;