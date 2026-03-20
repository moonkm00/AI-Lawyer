package com.ailawyer.backend.alert.repository;

import com.ailawyer.backend.alert.entity.NotificationEvent;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface NotificationEventRepository extends JpaRepository<NotificationEvent, Long> {
    // 특정 유저의 최근 알림을 시간순 내림차순(최신순)으로 가져오기
    List<NotificationEvent> findByReceiverIdOrderByEventTimeDesc(String receiverId);
}
