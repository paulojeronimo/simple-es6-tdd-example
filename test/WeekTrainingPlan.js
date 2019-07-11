import { expect } from "chai"
import moment from 'moment'

import WeekTrainingPlan from '../src/WeekTrainingPlan'
import TrainingSession from '../src/TrainingSession'

describe('Week training plan', () => {
    let trainingPlan

    beforeEach(() => {
        trainingPlan = new WeekTrainingPlan()
    })

    context('construction', () => {
        it('should throw an error if the date specified is invalid', () => {
            expect(() => trainingPlan.date = 'invalid date').to.throw(Error)
            expect(() => new TrainingPlan()).to.throw(Error)
            expect(() => new TrainingPlan('2019/07/11')).to.throw(Error)
        })

        it('should have a calculated week number based on the specified date', () => {
            trainingPlan.date = '2019-07-10'
            expect(trainingPlan.week).to.be.equal(28)
        })

        it('should throw an error if week number is setted', () => {
            expect(() => trainingPlan.week = 20).to.throw(TypeError)
        })

        it('should get the week number for the current week if a date is not specified', () =>  {
            const today = WeekTrainingPlan.formatedDate(new Date())
            expect(today).to.be.a.string
            expect(trainingPlan.date).not.null
            expect(trainingPlan.date).to.be.equals(today)
            expect(trainingPlan.week).to.be.equal(moment(today).isoWeek())
        })

        it('should get the same week number if we update the date inside same week', () => {
            //for (const day of [...Array(7).keys()].map(i => i+8 < 10 ? '0'+(i+8) : ''+(i+8))) {
            //for (const day of ['08', '09', '10', '11', '12', '13', '14' ]) {
                //trainingPlan.date = `2019-07-${day}`
            for (const day of Array.from(Array(7).keys()).map(i => i + 8)) {
                trainingPlan.date = `2019-07-${day < 10 ? '0'+day : day}`
                expect(trainingPlan.week).to.be.equal(28)
            }
        })

        it('should get the next week number if we set the date to some day in the next week', () => {
            trainingPlan.date = '2019-07-15'
            expect(trainingPlan.week).to.be.equal(29)
        })

        it('should get the previous week number if we set the date to some day in the previous week', () => {
            trainingPlan.date = '2019-07-07'
            expect(trainingPlan.week).to.be.equal(27)
        })

        it('should be possible to add some training sessions', () => {
            trainingPlan
                .addTrainingSession(new TrainingSession('Running', 'Thursday', '18 minutes'))
                .addTrainingSession(new TrainingSession('Calisthenics', 'Thursday', '15 minutes'))
                .addTrainingSession(new TrainingSession('Running', 'Thursday', '18 minutes'))
            expect(trainingPlan.trainingSessions).not.undefined.and.not.null
            expect(trainingPlan.trainingSessions).to.have.lengthOf(3)
        })
   })

   context('training sessions', () => {
        beforeEach(() => {
            trainingPlan
                .addTrainingSession(new TrainingSession('Running', 'Monday', '20 minutes'))
                .addTrainingSession(new TrainingSession('Swimming', 'Monday', '20 minutes'))
                .addTrainingSession(new TrainingSession('Running', 'Sunday', '60 minutes'))
                .addTrainingSession(new TrainingSession('Swimming', 'Saturday', '20 minutes'))
                .addTrainingSession(new TrainingSession('Swimming', 'Saturday', '30 minutes'))
        })

        it('should be filtered by training', () => {
            expect(trainingPlan.sessionsByTraining('Running')).to.eql([
                {day: 'Monday', duration: '20 minutes'},
                {day: 'Sunday', duration: '60 minutes'}
            ])
            expect(trainingPlan.sessionsByTraining('Swimming')).to.eql([
                {day: 'Monday', duration: '20 minutes'},
                {day: 'Saturday', duration: '20 minutes'},
                {day: 'Saturday', duration: '30 minutes'}
            ])
        })

        it('should be filtered by day', () => {
            expect(trainingPlan.sessionsByDay('Monday')).to.eql([
                {training: 'Running', duration: '20 minutes'},
                {training: 'Swimming', duration: '20 minutes'}
            ])
            expect(trainingPlan.sessionsByDay('Saturday')).to.eql([
                {training: 'Swimming', duration: '20 minutes'},
                {training: 'Swimming', duration: '30 minutes'}
            ])
        })
   })
})