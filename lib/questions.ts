export interface Question {
  id: number;
  text: string;
  options: {
    letter: 'A' | 'B' | 'C' | 'D';
    text: string;
  }[];
  correctAnswer: 'A' | 'B' | 'C' | 'D';
}

export const QUESTIONS: Question[] = [
  {
    id: 1,
    text: "Which day does the official opening of Oslo Innovation Week take place?",
    options: [
      { letter: 'A', text: "Monday 20 Oct" },
      { letter: 'B', text: "Tuesday 21 Oct" },
      { letter: 'C', text: "Wednesday 22 Oct" },
      { letter: 'D', text: "Thursday 23 Oct" }
    ],
    correctAnswer: 'A'
  },
  {
    id: 2,
    text: "Which tag is not listed among the filters for the programme?",
    options: [
      { letter: 'A', text: "Blue Economy" },
      { letter: 'B', text: "ClimateTech" },
      { letter: 'C', text: "FinTech" },
      { letter: 'D', text: "BioFashion" }
    ],
    correctAnswer: 'D'
  },
  {
    id: 3,
    text: "The event 'Startuplab Summit' is scheduled for which day?",
    options: [
      { letter: 'A', text: "Monday" },
      { letter: 'B', text: "Tuesday" },
      { letter: 'C', text: "Wednesday" },
      { letter: 'D', text: "Thursday" }
    ],
    correctAnswer: 'B'
  },
  {
    id: 4,
    text: "What is the time slot for 'Getting Even More Impact Bang for your Buck'?",
    options: [
      { letter: 'A', text: "Thursday 8:30–11:00" },
      { letter: 'B', text: "Wednesday 8:30–11:00" },
      { letter: 'C', text: "Friday 8:30–11:00" },
      { letter: 'D', text: "Tuesday 8:30–11:00" }
    ],
    correctAnswer: 'A'
  },
  {
    id: 5,
    text: "Which organization is not listed as organiser for 'Unleashed – a Corporate Innovation Summit'?",
    options: [
      { letter: 'A', text: "Reodor Studios AS" },
      { letter: 'B', text: "Eldorado" },
      { letter: 'C', text: "Innovation Norway" },
      { letter: 'D', text: "Oslo Business Region" }
    ],
    correctAnswer: 'C'
  },
  {
    id: 6,
    text: "What is the title of the 'Afterparty' event on Thursday?",
    options: [
      { letter: 'A', text: "Official After Party" },
      { letter: 'B', text: "Venture Karaoke Night" },
      { letter: 'C', text: "Official Opening Party" },
      { letter: 'D', text: "Oslo Innovation Fest" }
    ],
    correctAnswer: 'A'
  },
  {
    id: 7,
    text: "Which summit focuses on PropTech on Wednesday?",
    options: [
      { letter: 'A', text: "Oslo Proptech Summit 2025" },
      { letter: 'B', text: "Diversify Summit" },
      { letter: 'C', text: "Nordic Fund Day" },
      { letter: 'D', text: "Science Impact 2025" }
    ],
    correctAnswer: 'A'
  },
  {
    id: 8,
    text: "Which of these is a tag listed for the programme?",
    options: [
      { letter: 'A', text: "Talent" },
      { letter: 'B', text: "Augmented Reality" },
      { letter: 'C', text: "Digital Fashion" },
      { letter: 'D', text: "Smart Homes" }
    ],
    correctAnswer: 'A'
  },
  {
    id: 9,
    text: "Which location is listed for 'MeetingPoint: student innovators meets humanitarian organisations...'?",
    options: [
      { letter: 'A', text: "Punkt Oslo" },
      { letter: 'B', text: "Mesh Youngstorget" },
      { letter: 'C', text: "Skagerak Capital" },
      { letter: 'D', text: "House 21" }
    ],
    correctAnswer: 'A'
  },
  {
    id: 10,
    text: "'Who Owns the Algorithm? AI, Corporate Power & Human Rights' is held on which day/time?",
    options: [
      { letter: 'A', text: "Wednesday 16:30–18:30" },
      { letter: 'B', text: "Thursday 16:30–18:30" },
      { letter: 'C', text: "Wednesday 14:30–16:30" },
      { letter: 'D', text: "Tuesday 16:30–18:30" }
    ],
    correctAnswer: 'A'
  }
];

export const QUESTION_TIME_LIMIT = 20; // seconds
export const BASE_POINTS = 1000;
export const SPEED_BONUS_MAX = 500;
