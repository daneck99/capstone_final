package com.seatify.backend.api;

import static com.seatify.backend.support.fixture.MemberFixture.*;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.BDDMockito.*;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.result.MockMvcResultHandlers;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;

import com.seatify.backend.api.login.service.OAuthLoginService;
import com.seatify.backend.api.logout.service.LogoutService;
import com.seatify.backend.api.member.service.MemberInfoService;
import com.seatify.backend.api.member.service.MyPageService;
import com.seatify.backend.api.token.service.TokenService;
import com.seatify.backend.domain.cafe.service.CafeService;
import com.seatify.backend.domain.comment.service.CommentService;
import com.seatify.backend.domain.member.service.MemberService;
import com.seatify.backend.domain.review.service.ReviewService;
import com.seatify.backend.domain.viewedcafe.service.ViewedCafeService;
import com.seatify.backend.global.error.GlobalExceptionHandler;
import com.seatify.backend.global.resolver.MemberInfoArgumentResolver;

@ExtendWith(MockitoExtension.class)
public abstract class ControllerTestSupporter {

	@Mock
	protected CafeService cafeService;

	@Mock
	protected ViewedCafeService viewedCafeService;

	@Mock
	protected MemberService memberService;

	@Mock
	protected CommentService commentService;

	@Mock
	protected LogoutService logoutService;

	@Mock
	protected MemberInfoService memberInfoService;

	@Mock
	protected MyPageService myPageService;

	@Mock
	protected OAuthLoginService oAuthLoginService;

	@Mock
	protected ReviewService reviewService;

	@Mock
	protected TokenService tokenService;

	@Mock
	private MemberInfoArgumentResolver memberInfoArgumentResolver;

	@BeforeEach
	void setUp() throws Exception {
		lenient().when(memberInfoArgumentResolver.supportsParameter(any()))
			.thenReturn(true);

		lenient().when(memberInfoArgumentResolver.resolveArgument(any(), any(), any(), any()))
			.thenReturn(MEMBER_INFO_DTO);
	}

	protected MockMvc mockMvc(Object controller) {
		return MockMvcBuilders.standaloneSetup(controller)
			.setControllerAdvice(new GlobalExceptionHandler())
			.setCustomArgumentResolvers(memberInfoArgumentResolver)
			.alwaysDo(MockMvcResultHandlers.print())
			.build();
	}
}
