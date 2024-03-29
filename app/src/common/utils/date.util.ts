import {convert, DateTimeFormatter, LocalDate, LocalDateTime, nativeJs, ZoneId,} from '@js-joda/core';

export class DateUtil {
    private static DATE_TIME_FORMATTER = DateTimeFormatter.ofPattern('yyyy-MM-dd HH:mm:ss');
    static stringNow(): string {
        return LocalDateTime.now().plusHours(9).format(this.DATE_TIME_FORMATTER);
    }

    static dateNow(): Date {
        return convert(LocalDateTime.now().plusHours(9)).toDate();
    }

    static toDate(localDate: LocalDate | LocalDateTime): Date {
        if (!localDate) {
            return null;
        }

        return convert(localDate).toDate();
    }

    static toLocalDateTime(date: Date): LocalDateTime {
        if (!date) {
            return null;
        }
        return LocalDateTime.from(nativeJs(date));
    }
}
