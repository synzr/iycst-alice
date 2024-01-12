import type { BunFile } from 'bun'
import path from 'path'
import { fetchText } from './verstov'

function createAliceResponse (message: string, statusCode: number = 200): Response {
  const response = {
    response: { text: message, tts: message, end_session: true },
    version: '1.0'
  }

  return new Response(
    JSON.stringify(response),
    {
      headers: { 'content-type': 'application/json; charset=utf-8' },
      status: statusCode
    }
  )
}

async function fetch (request: Request): Promise<Response> {
  if (request.method === 'GET') {
    const file: BunFile = Bun.file(
      path.join(import.meta.dir, '../assets/silly-billy.jpg')
    )

    return new Response(file, { status: 405 })
  }

  if (request.method !== 'POST') {
    return createAliceResponse('Неверный метод HTTP.', 405)
  }

  const requestData = await request.json() as {
    session: { skill_id: string }
  }

  if (requestData.session.skill_id !== Bun.env.SKILL_ID) {
    return createAliceResponse('Неверный идентификатор диалога.', 403)
  }

  return createAliceResponse(
    await fetchText()
  )
}

Bun.serve({ fetch: fetch })
