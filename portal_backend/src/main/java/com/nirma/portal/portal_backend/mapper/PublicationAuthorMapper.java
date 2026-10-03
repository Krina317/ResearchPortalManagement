package com.nirma.portal.portal_backend.mapper;

import java.util.List;

import org.mapstruct.Mapper;

import com.nirma.portal.portal_backend.dto.PublicationAuthorResponseDTO;
import com.nirma.portal.portal_backend.entity.PublicationAuthor;

@Mapper(componentModel = "spring",
		uses = AuthorMasterMapper.class)
public interface PublicationAuthorMapper {
	PublicationAuthorResponseDTO toResponseDTO(PublicationAuthor entity);
	List<PublicationAuthorResponseDTO> toResponseDTOList(List<PublicationAuthor> entities);
}
