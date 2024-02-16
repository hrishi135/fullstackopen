import axios from 'axios';
import { DiaryEntry, NewDiaryEntry, NonSensitiveDiaryEntry } from '../types';
const baseUrl = 'http://localhost:3001/api/diaries'

const getAll = async (): Promise<NonSensitiveDiaryEntry[]> => {
  const response = await axios.get(baseUrl);
  return response.data as NonSensitiveDiaryEntry[];
}

const create = async (newEntry: NewDiaryEntry): Promise<DiaryEntry> => {
  const response = await axios.post(baseUrl, newEntry);
  return response.data as DiaryEntry;
}


export default { getAll, create }