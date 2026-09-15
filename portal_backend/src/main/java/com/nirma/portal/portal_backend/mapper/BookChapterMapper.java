package com.nirma.portal.portal_backend.mapper;

import java.util.List;

import org.mapstruct.Mapper;

import com.nirma.portal.portal_backend.dto.BookChapterRequestDTO;
import com.nirma.portal.portal_backend.dto.BookChapterResponseDTO;
import com.nirma.portal.portal_backend.entity.BookChapter;

@Mapper(componentModel = "spring")
public interface BookChapterMapper {

    BookChapterResponseDTO toResponseDTO(BookChapter entity);

    BookChapter toEntity(BookChapterRequestDTO dto);

    List<BookChapterResponseDTO> toResponseDTOList(List<BookChapter> entities);
}