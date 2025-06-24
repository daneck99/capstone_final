package com.seatify.backend.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.jdbc.Sql;

import com.seatify.backend.domain.comment.repository.CommentRepository;
import com.seatify.backend.domain.comment.service.CommentService;
import com.seatify.backend.support.utils.DataBaseSupporter;
import com.seatify.backend.support.utils.ServiceTest;

@ServiceTest
@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
@Sql("/sql/comment.sql")
class CommentServiceTest extends DataBaseSupporter {

	@Autowired
	private CommentService commentService;

	@Autowired
	private CommentRepository commentRepository;

}
