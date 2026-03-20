package com.ailawyer.backend.alert.repository;

import com.ailawyer.backend.alert.entity.BlacklistKeyword;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface BlacklistKeywordRepository extends JpaRepository<BlacklistKeyword, Long> {
    Optional<BlacklistKeyword> findByKeyword(String keyword);
}
