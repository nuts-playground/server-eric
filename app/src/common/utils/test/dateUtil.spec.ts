import {convert, DateTimeFormatter, LocalDate, LocalDateTime, LocalTime, nativeJs} from '@js-joda/core';

describe('date util test', () => {
    const dataFormat = DateTimeFormatter.ofPattern('yyyy-MM-dd HH:mm:ss.SSSSSS');
    describe('test', () => {
        it('test test', () => {
            // let nowTime = LocalDateTime.now().format(dataFormat);
            console.log(convert(LocalDateTime.now()).toDate());
            console.log(convert(LocalDateTime.now().plusHours(9)).toDate());
            // console.log(LocalDateTime.now().plusHours(9).toString())
        });
    });
});
