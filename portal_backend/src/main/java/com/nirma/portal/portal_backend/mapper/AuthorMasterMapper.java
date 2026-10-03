package com.nirma.portal.portal_backend.mapper;

import java.util.List;

import org.mapstruct.Mapper;

import com.nirma.portal.portal_backend.dto.AuthorMasterResponseDTO;
import com.nirma.portal.portal_backend.entity.AuthorMaster;

@Mapper(componentModel = "spring")
public interface AuthorMasterMapper {
	AuthorMasterResponseDTO toResponseDTO(AuthorMaster entity);
	List<AuthorMasterResponseDTO> toResponseDTOList(List<AuthorMaster> entities);
}
