package com.seatify.backend.security;

import static org.assertj.core.api.Assertions.*;

import org.junit.jupiter.api.Test;

import com.seatify.backend.global.config.web.HtmlCharacterEscapes;
import com.fasterxml.jackson.core.SerializableString;

class HtmlCharacterEscapesTest {

	@Test
	public void 이스케이프_문자를_테스트한다() {
		HtmlCharacterEscapes escapes = new HtmlCharacterEscapes();

		SerializableString basicEscapeSequence = escapes.getEscapeSequence('<');
		SerializableString customEscapeSequence = escapes.getEscapeSequence('(');

		assertThat(basicEscapeSequence.getValue()).isEqualTo("&lt;");
		assertThat(customEscapeSequence.getValue()).isEqualTo("&#40;");
	}
}
