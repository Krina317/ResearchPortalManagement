package com.nirma.portal.portal_backend.mapper;

import java.util.List;

import org.mapstruct.Mapper;

import com.nirma.portal.portal_backend.DTO.AuthorRecordRequestDTO;
import com.nirma.portal.portal_backend.DTO.AuthorRecordResponseDTO;
import com.nirma.portal.portal_backend.entity.AuthorRecord;

@Mapper(componentModel = "spring")
public interface AuthorRecordMapper {
	  AuthorRecordResponseDTO toResponseDTO(AuthorRecord entity);
	  AuthorRecord toEntity(AuthorRecordRequestDTO dto);
	  List<AuthorRecordResponseDTO> toResponseDTOList(List<AuthorRecord> entities);
}
