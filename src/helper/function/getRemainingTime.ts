export function getRemainingTime(time: number): string {
  const remainingTime =
    Date.now() - new Date(time).getTime() < 0
      ? 0
      : Date.now() - new Date(time).getTime();
  const days = Math.floor(remainingTime / (1000 * 60 * 60 * 24));

  let returnedTime = {
    value: days,
    type: "ngày",
  };

  if (returnedTime.value === 0) {
    returnedTime = {
      value: Math.floor((remainingTime / (1000 * 60 * 60)) % 24), // convert to hours
      type: "giờ",
    };

    //check if hours === 0 or Not
    if (returnedTime.value === 0) {
      returnedTime = {
        value: Math.floor((remainingTime / 1000 / 60) % 60), // convert to minutes
        type: "phút",
      };
    }
  }

  return `${returnedTime.value} ${returnedTime.type}`;
}
