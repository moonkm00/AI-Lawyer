package com.ailawyer.backend.alert.repository;

import com.ailawyer.backend.alert.entity.ContractDocument;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ContractDocumentRepository extends JpaRepository<ContractDocument, Long> {
}
