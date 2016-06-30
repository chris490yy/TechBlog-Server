var express = require('express');
var router = express.Router();
var mongoose = require('../config/mongoose.config');
// register the comment schema
require('../models/comment.model');
var Comment = mongoose.model("Comment");

exports.add = function(req, res){
	console.log("begin to add a 1-level comments");
	var articleId = req.body.articleId;
	var creator = req.body.creator;
	var content = req.body.content;
	console.log(req.body.articleId);
	Comment.findOne({articleId:articleId}, function(err, comment){
		console.log(comment);
		if(comment == undefined){
			comment = new Comment();
			comment.articleId = articleId;
			comment.comments = [{
				creator: creator,
				content: content,
				time: new Date(),
				comments2comments:[]
			}];
		}else{
			comment.comments.push({
				creator: creator,
				content: content,
				time: new Date(),
				comments2comments:[]
			});
		}
		comment.save(function(err){
	    if(err)
	    	res.jsonp(err);
	    else
	    	res.jsonp(comment);
	  });
	});

}

exports.addReply = function(req, res){
	var creator = req.body.creator;
	var articleId = req.body.articleId;
	var atter = req.body.atter;
	var replyer = req.body.replyer;
	var content = req.body.content;
	console.log(req.body.content);
	Comment.findOne({articleId:articleId}, function(err, comment){
		console.log(comment);
		if(comment != undefined){
			var comments = comment.comments;
			for(let i = 0; i < comments.length; i++){
				if(comments[i].creator === creator){
					comment.comments[i].comments2comments.push({
						replyer: replyer,
						content: content,
						atter: atter,
						time: new Date()
					});
				}
			}
			comment.save(function(err){
				if(err)
	    		res.jsonp(err);
	    	else
	    		res.jsonp(comment);
			});
		}else{
			res.jsonp({message:"not existing 1-level comment, so cannot reply"});
		}
		});

}

exports.read = function(req, res){
	console.log(req.params.articleId);
	var articleId = req.params.articleId;
	var comment = Comment.findOne({articleId:articleId}, function(err, comment){
		if(err)
			res.jsonp(err);
		else
			res.jsonp(comment.comments);
	});
}


/*
var CommentSchema = new Schema({
	articleId: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'Article'
	},
	comments: [{
		creator: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'User'
		},
		content: String,
		time: Date,
		comments2comments:[{
			replyer:{
				type: mongoose.Schema.Types.ObjectId,
				ref: 'User'
			}
			time: Date,
			content: String,
			atter:{
				type: mongoose.Schema.Types.ObjectId,
				ref: 'User'
			}
		}],
	}],
});

*/