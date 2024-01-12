import { fetchText } from './verstov'

function createAliceResponse (message: string): Response {
  return Response.json({
    response: { text: message, tts: message, end_session: true },
    version: '1.0'
  })
}

async function fetch (request: Request): Promise<Response> {
  if (request.method !== 'POST') {
    return createAliceResponse('Неверный метод HTTP.')
  }

  const requestData = await request.json() as {
    session: { skill_id: string }
  }

  if (requestData.session.skill_id !== Bun.env.SKILL_ID) {
    return createAliceResponse('Неверный идентификатор диалога.')
  }

  return createAliceResponse(
    await fetchText()
  )
}

Bun.serve({ fetch: fetch })
