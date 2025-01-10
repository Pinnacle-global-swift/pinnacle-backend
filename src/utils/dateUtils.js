export const isWorkingDaysValid = (startDate, requiredDays) => {
    const currentDate = new Date();
    let workingDays = 0;
    let currentDay = new Date(startDate);
  
    while (currentDay <= currentDate && workingDays < requiredDays) {
      const dayOfWeek = currentDay.getDay();
      
      // Count Monday-Friday (1-5)
      if (dayOfWeek !== 0 && dayOfWeek !== 6) {
        workingDays++;
      }
  
      currentDay.setDate(currentDay.getDate() + 1);
    }
  
    return workingDays >= requiredDays;
  };