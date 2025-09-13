export const getAvailableTimeSlots = (scheduledCalls, startTime, endTime, duration) => {
    const slots = [];
    let currentTime = new Date(startTime);

    while (currentTime < endTime) {
        const isScheduled = scheduledCalls.some(call => {
            const callStart = new Date(call.startTime);
            const callEnd = new Date(callStart.getTime() + call.duration * 60000);
            return currentTime < callEnd && currentTime.getTime() + duration * 60000 > callStart.getTime();
        });

        if (!isScheduled) {
            slots.push(new Date(currentTime));
        }

        currentTime.setMinutes(currentTime.getMinutes() + 30); // Increment by 30 minutes
    }

    return slots;
};

export const createRepetitionSchedule = (startDate, repetitionType, frequency) => {
    const schedule = [];
    let nextDate = new Date(startDate);

    for (let i = 0; i < frequency; i++) {
        schedule.push(new Date(nextDate));
        if (repetitionType === 'daily') {
            nextDate.setDate(nextDate.getDate() + 1);
        } else if (repetitionType === 'weekly') {
            nextDate.setDate(nextDate.getDate() + 7);
        } else if (repetitionType === 'biweekly') {
            nextDate.setDate(nextDate.getDate() + 14);
        } else if (repetitionType === 'monthly') {
            nextDate.setMonth(nextDate.getMonth() + 1);
        }
    }

    return schedule;
};

export const generateChecklist = (patients) => {
    return patients.map(patient => {
        return {
            patientName: patient.name,
            discussionPoints: [
                `Discuss recent diagnosis for ${patient.diagnosis}`,
                `Review medication for ${patient.name}`,
                `Check on ${patient.name}'s overall health status`
            ]
        };
    });
};