import moment from 'moment'

class WeekTrainingPlan {
    static dateFormat() {
        return 'YYYY-MM-DD'
    }

    static formatedDate(date = new Date()) {
        const invalidDate = "Invalid date"
        if (moment(date, WeekTrainingPlan.dateFormat(), true).format() === invalidDate) {
            throw new Error(invalidDate)
        }
        return moment(date).format(WeekTrainingPlan.dateFormat())
    }

    constructor(date) {
        this._date = WeekTrainingPlan.formatedDate(date)
    }

    set date(newDate) {
        this._date = WeekTrainingPlan.formatedDate(newDate)
    }

    get date() {
        return this._date
    }

    get week() {
        return moment(this._date).isoWeek()
    }

    addTrainingSession(trainingSession) {
        if (!this.trainingSessions) {
            this.trainingSessions = []
        }
        this.trainingSessions.push(trainingSession)

        return this
    }

    sessionsByTraining(training) {
        return this.trainingSessions
            .filter(session => session.training === training)
            .map(session => ({day: session.day, duration: session.duration}))
    }

    sessionsByDay(day) {
        return this.trainingSessions
            .filter(session => session.day === day)
            .map(session => ({training: session.training, duration: session.duration}))
    }
}

export default WeekTrainingPlan