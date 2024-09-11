import Vue from "vue";
import numbro from "numbro";

Vue.filter("getinStringFormat", function (string) {
  return string;
});

Vue.filter("getinNumberFormat", function (number) {
  return numbro(number).format({ thousandSeparated: true, mantissa: 0 });
});

Vue.filter("getinDecimalNumberFormat", function (number) {
  return numbro(number).format({ thousandSeparated: true, mantissa: 2 });
});

Vue.filter("getinPercentFormat", function (number) {
  return numbro(number / 100).format({ output: "percent", mantissa: 2 });
});

Vue.filter("getinRoundFormat", function (number) {
  return numbro(number).format({ mantissa: 2 });
});

Vue.filter("getinMinuteFormat", function (number) {
  return numbro(number).format({ mantissa: 2 }) + " min";
});

Vue.filter("getinCurrencyFormat", function (number) {
  return numbro(number).formatCurrency({
    mantissa: 2,
    thousandSeparated: true,
  });
});

Vue.filter("getinDynamicFilter", function (value, filter) {
  return Vue.filter(filter)(value);
});

Vue.filter("getinNumberDayFormat", function (number) {
  return (
    numbro(number).format({ thousandSeparated: true, mantissa: 0 }) + " días"
  );
});
