const request = require('supertest');
const app = require('../app');

describe('Create task test', () => {
  it('Create task with only requered fields', async () => {
    const response = await request(app)
      .post('/tasks')
      .send({name:"task",priority:1})

    expect(response.status).toBe(200)
    expect(response.body.name).toBe('task')
    expect(response.body.priority).toBe(1)
  })

  it('Create task with empty name', async () => {
    const response = await request(app)
      .post('/tasks')
      .send({name:"",priority:1})

    expect(response.status).toBe(400)
    expect(response.body.error).toContain('name is required.')
  })

  it('Create task with priority as string', async () => {
    const response = await request(app)
      .post('/tasks')
      .send({name:"task",priority:"a"})

    expect(response.status).toBe(400)
    expect(response.body.error).toContain("Type of 'priority' must be a string.")
  })

  it('Create task with priority is missing', async () => {
    const response = await request(app)
      .post('/tasks')
      .send({name:"task"})

    expect(response.status).toBe(400)
    expect(response.body.error).toContain("priority is required.")
  })

  it('Create task with description invalid', async () => {
    const response = await request(app)
      .post('/tasks')
      .send({name:"task",priority:1,description: 2})

    expect(response.status).toBe(400)
    expect(response.body.error).toContain("Type of 'description' must be a string.")
  })

  it('Create task with scheduled date is a number', async () => {
    const response = await request(app)
      .post('/tasks')
      .send({name:"task",priority:1,scheduled_date: 1})

    expect(response.status).toBe(400)
    expect(response.body.error).toContain("schedule_date must be in the format YYYY-MM-DD HH:MM.")
  })

  it('Create task with scheduled date is invalid', async () => {
    const response = await request(app)
      .post('/tasks')
      .send({name:"task",priority:1,scheduled_date: "abc"})

    expect(response.status).toBe(400)
    expect(response.body.error).toContain("schedule_date must be in the format YYYY-MM-DD HH:MM.")
  })

  it('Create task with scheduled date is in past', async () => {
    const response = await request(app)
      .post('/tasks')
      .send({name:"task",priority:1,scheduled_date: "2024-01-01 10:00"})

    expect(response.status).toBe(400)
    expect(response.body.error).toContain("schedule_date cannot be in the past.")
  })

  it('Create task with duration is invalid', async () => {
    const response = await request(app)
      .post('/tasks')
      .send({name:"task",priority:1,duration: "abc"})

    expect(response.status).toBe(400)
    expect(response.body.error).toContain("Type of 'duration' must be a string.")
  })
})
