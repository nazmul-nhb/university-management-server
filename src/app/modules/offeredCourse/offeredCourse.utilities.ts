import type { TSchedule } from './offeredCourse.types';

export const hasTimeConflict = (
	assignedSchedules: TSchedule[],
	newSchedule: TSchedule,
): boolean =>
	assignedSchedules.some((schedule) => {
		const existingStartTime = new Date(`1970-01-01T${schedule.startTime}`);
		const existingEndTime = new Date(`1970-01-01T${schedule.endTime}`);
		const newStartTime = new Date(`1970-01-01T${newSchedule.startTime}`);
		const newEndTime = new Date(`1970-01-01T${newSchedule.endTime}`);

		// 10:30 - 12:30
		// 11:30 - 1.30
		// Check if new schedule overlaps with existing schedule
		return newStartTime < existingEndTime && newEndTime > existingStartTime;
	});
