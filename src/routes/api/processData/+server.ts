import {json, text} from '@sveltejs/kit';
import type {RequestHandler} from './$types';

export const GET: RequestHandler = async ({url}) => {
  const number = Math.floor(Math.random() * 6) + 1;
  return json({
    number,
    q: url.searchParams.get('q'),
  });
};

export const fallback: RequestHandler = async ({request}) => {
  return text(`I caught your ${request.method} request!`);
}