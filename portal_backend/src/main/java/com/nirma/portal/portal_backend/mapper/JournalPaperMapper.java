package com.nirma.portal.portal_backend.mapper;

import java.util.List;
import org.mapstruct.Mapper;
import com.nirma.portal.portal_backend.dto.JournalPaperRequestDTO;
import com.nirma.portal.portal_backend.dto.JournalPaperResponseDTO;
import com.nirma.portal.portal_backend.entity.JournalPaper;

@Mapper(componentModel = "spring")
public interface JournalPaperMapper {
    JournalPaperResponseDTO toResponseDTO(JournalPaper entity);
    JournalPaper toEntity(JournalPaperRequestDTO dto);
    List<JournalPaperResponseDTO> toResponseDTOList(List<JournalPaper> entities);
}