import moment from 'moment'

export function getNaturalTimeFromDate(date: Date, relativeThreshold: number = 3): string {
	const thresholdTime = new Date()
	thresholdTime.setHours(thresholdTime.getHours() - relativeThreshold)

	if (date < thresholdTime) {
		return moment(date).calendar(null, {
			sameDay: '[today at] HH:mm',
			lastDay: '[yesterday at] HH:mm',
			sameElse: 'MMM D [at] HH:mm',
		})
	} else {
		return moment(date).fromNow()
	}
}
