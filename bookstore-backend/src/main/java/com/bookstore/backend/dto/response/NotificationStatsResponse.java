package com.bookstore.backend.dto.response;

import lombok.*;
import lombok.experimental.FieldDefaults;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class NotificationStatsResponse {
    Long totalNotifications;
    Long unreadNotifications;
    Long readNotifications;
    Long todayNotifications;
    Long thisWeekNotifications;
}
