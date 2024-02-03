import type { FormatDistanceFnOptions, FormatDistanceToken } from "date-fns";

export const formatDistance = (
  token: FormatDistanceToken,
  count: number,
  options: FormatDistanceFnOptions | undefined
) => {
  options = options ?? {};

  const formatDistanceLocale = {
    lessThanXSeconds: "now",
    xSeconds: "now",
    halfAMinute: "30s",
    lessThanXMinutes: "{{count}}m",
    xMinutes: "{{count}}m",
    aboutXHours: "{{count}}h",
    xHours: "{{count}}h",
    xDays: "{{count}}d",
    aboutXWeeks: "{{count}}w",
    xWeeks: "{{count}}w",
    aboutXMonths: "{{count}}m",
    xMonths: "{{count}}m",
    aboutXYears: "{{count}}y",
    xYears: "{{count}}y",
    overXYears: "{{count}}y",
    almostXYears: "{{count}}y",
  };

  const result = formatDistanceLocale[token].replace(
    "{{count}}",
    count.toString()
  );

  if (options.addSuffix) {
    if (options.comparison! > 0) {
      return "in " + result;
    } else {
      return result + " ago";
    }
  }

  return result;
};
