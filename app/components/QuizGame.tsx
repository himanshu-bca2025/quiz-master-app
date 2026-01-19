'use client';
import React, { useState, useEffect } from 'react';

interface QuizGameProps {
  user: { id: string; username: string };
  userData: {
    coins: number;
    level: number;
    questionsCompleted: number;
    purchases: string[];
    theme: string;
  };
  onUpdateCoins: (coins: number, level?: number) => void;
  onBackToDashboard: () => void;
}

interface Question {
  id: number;
  q: string;
  options: string[];
  ans: string;
  cat: string;
  difficulty: 'easy' | 'medium' | 'hard';
}

const QUESTION_BANK: Question[] = [
  // EASY Questions (50+)
  { id: 1, q: "3 ka 10% kitna hoga?", options: ["0.3", "3", "30", "0.03"], ans: "0.3", cat: "Math", difficulty: "easy" },
  { id: 2, q: "Computer ka brain kise kehte hain?", options: ["RAM", "CPU", "Monitor", "Keyboard"], ans: "CPU", cat: "Science", difficulty: "easy" },
  { id: 3, q: "Odd one out chune:", options: ["Car", "Bike", "Truck", "Apple"], ans: "Apple", cat: "Reasoning", difficulty: "easy" },
  { id: 4, q: "C Language me 'printf' ka kya kaam hai?", options: ["Input", "Output", "Loop", "Delete"], ans: "Output", cat: "BCA Basics", difficulty: "easy" },
  { id: 5, q: "Next number kya hoga? 2, 4, 6, 8, ...?", options: ["9", "10", "11", "12"], ans: "10", cat: "Reasoning", difficulty: "easy" },
  { id: 6, q: "2+2 ka answer kya hoga?", options: ["3", "4", "5", "6"], ans: "4", cat: "Math", difficulty: "easy" },
  { id: 7, q: "Water ka boiling point kitna hota hai?", options: ["80°C", "100°C", "120°C", "150°C"], ans: "100°C", cat: "Science", difficulty: "easy" },
  { id: 8, q: "Earth ke kitne continents hain?", options: ["5", "6", "7", "8"], ans: "7", cat: "Geography", difficulty: "easy" },
  { id: 9, q: "Sun kitne planets ke liye light deta hai?", options: ["7", "8", "9", "10"], ans: "8", cat: "Science", difficulty: "easy" },
  { id: 10, q: "'Beautiful' ka meaning kya hota hai?", options: ["Ugly", "Pretty", "Bad", "Small"], ans: "Pretty", cat: "English", difficulty: "easy" },
  { id: 11, q: "5+3 = ?", options: ["7", "8", "9", "10"], ans: "8", cat: "Math", difficulty: "easy" },
  { id: 12, q: "Zebra ka color kya hota hai?", options: ["Brown", "Gray", "Black aur White", "Orange"], ans: "Black aur White", cat: "Geography", difficulty: "easy" },
  { id: 13, q: "Lion ka sound kya hota hai?", options: ["Bark", "Roar", "Tweet", "Hiss"], ans: "Roar", cat: "Science", difficulty: "easy" },
  { id: 14, q: "100 ka 1% kitna hota hai?", options: ["0.1", "1", "10", "100"], ans: "1", cat: "Math", difficulty: "easy" },
  { id: 15, q: "Keyboard ka key 'Enter' ka use kya hota hai?", options: ["Delete", "Next line", "Space", "Escape"], ans: "Next line", cat: "BCA Basics", difficulty: "easy" },
  { id: 16, q: "Python ek kya hai?", options: ["Animal", "Language", "Country", "Food"], ans: "Language", cat: "BCA Basics", difficulty: "easy" },
  { id: 17, q: "Rose ka color kya hota hai?", options: ["Green", "Red", "Blue", "Yellow"], ans: "Red", cat: "Geography", difficulty: "easy" },
  { id: 18, q: "Opposite of 'Hot' kya hota hai?", options: ["Warm", "Cold", "Cool", "Freeze"], ans: "Cold", cat: "English", difficulty: "easy" },
  { id: 19, q: "1+1+1 = ?", options: ["2", "3", "1", "4"], ans: "3", cat: "Math", difficulty: "easy" },
  { id: 20, q: "Apple ek kya hai?", options: ["Vegetable", "Fruit", "Metal", "Stone"], ans: "Fruit", cat: "Science", difficulty: "easy" },
  { id: 21, q: "Sky ka color kya hota hai?", options: ["Green", "Blue", "Red", "Black"], ans: "Blue", cat: "Geography", difficulty: "easy" },
  { id: 22, q: "Book padne se kya hota hai?", options: ["Dizzy", "Smart", "Tired", "Happy"], ans: "Smart", cat: "English", difficulty: "easy" },
  { id: 23, q: "Milk white color ka hai - True ya False?", options: ["True", "False", "Maybe", "Not sure"], ans: "True", cat: "Reasoning", difficulty: "easy" },
  { id: 24, q: "Mon-Tue-Wed ke baad kya aata hai?", options: ["Friday", "Thursday", "Saturday", "Sunday"], ans: "Thursday", cat: "Reasoning", difficulty: "easy" },
  { id: 25, q: "10-5 = ?", options: ["4", "5", "6", "15"], ans: "5", cat: "Math", difficulty: "easy" },
  { id: 26, q: "Mouse ek computer ka kya hota hai?", options: ["Monitor", "Device", "Keyboard", "Speaker"], ans: "Device", cat: "BCA Basics", difficulty: "easy" },
  { id: 27, q: "Bicycle mein kitne wheels hote hain?", options: ["1", "2", "3", "4"], ans: "2", cat: "Reasoning", difficulty: "easy" },
  { id: 28, q: "Oxygen plants se kya dete hain?", options: ["Carbon", "Nitrogen", "Oxygen", "Hydrogen"], ans: "Oxygen", cat: "Science", difficulty: "easy" },
  { id: 29, q: "Opposite of 'Left' kya hota hai?", options: ["Down", "Up", "Right", "Forward"], ans: "Right", cat: "English", difficulty: "easy" },
  { id: 30, q: "Table ka color zyada-tar kya hota hai?", options: ["Red", "Blue", "Brown", "Green"], ans: "Brown", cat: "Geography", difficulty: "easy" },
  { id: 31, q: "20 ÷ 4 = ?", options: ["4", "5", "6", "7"], ans: "5", cat: "Math", difficulty: "easy" },
  { id: 32, q: "Facebook founder kaun hain?", options: ["Steve Jobs", "Mark Zuckerberg", "Bill Gates", "Elon Musk"], ans: "Mark Zuckerberg", cat: "BCA Basics", difficulty: "easy" },
  { id: 33, q: "India ka national animal kya hai?", options: ["Lion", "Tiger", "Elephant", "Deer"], ans: "Tiger", cat: "Geography", difficulty: "easy" },
  { id: 34, q: "Night ka opposite kya hota hai?", options: ["Dark", "Day", "Evening", "Morning"], ans: "Day", cat: "English", difficulty: "easy" },
  { id: 35, q: "12 × 1 = ?", options: ["11", "12", "13", "24"], ans: "12", cat: "Math", difficulty: "easy" },
  { id: 36, q: "Blood red color ka hota hai - True ya False?", options: ["True", "False", "Sometimes", "Maybe"], ans: "True", cat: "Reasoning", difficulty: "easy" },
  { id: 37, q: "Cricket mein kitne players hote hain?", options: ["8", "9", "10", "11"], ans: "11", cat: "Reasoning", difficulty: "easy" },
  { id: 38, q: "Monitor kya karta hai?", options: ["Input", "Output", "Process", "Store"], ans: "Output", cat: "BCA Basics", difficulty: "easy" },
  { id: 39, q: "Agar A>B aur B>C toh A>C - True ya False?", options: ["True", "False", "Maybe", "Not sure"], ans: "True", cat: "Reasoning", difficulty: "easy" },
  { id: 40, q: "50% of 100 = ?", options: ["25", "50", "75", "100"], ans: "50", cat: "Math", difficulty: "easy" },
  { id: 41, q: "Iron hard metal hai - True ya False?", options: ["True", "False", "Maybe", "Not sure"], ans: "True", cat: "Science", difficulty: "easy" },
  { id: 42, q: "Rainbow mein kitne colors hote hain?", options: ["5", "6", "7", "8"], ans: "7", cat: "Science", difficulty: "easy" },
  { id: 43, q: "Pen se likha jata hai - True ya False?", options: ["True", "False", "Maybe", "Not sure"], ans: "True", cat: "Reasoning", difficulty: "easy" },
  { id: 44, q: "3 × 3 = ?", options: ["6", "8", "9", "12"], ans: "9", cat: "Math", difficulty: "easy" },
  { id: 45, q: "Clock se time pata chalta hai - True ya False?", options: ["True", "False", "Maybe", "Not sure"], ans: "True", cat: "Reasoning", difficulty: "easy" },
  { id: 46, q: "Opposite of 'Big' kya hota hai?", options: ["Huge", "Small", "Large", "Thick"], ans: "Small", cat: "English", difficulty: "easy" },
  { id: 47, q: "Light ka speed fast hota hai - True ya False?", options: ["True", "False", "Maybe", "Not sure"], ans: "True", cat: "Science", difficulty: "easy" },
  { id: 48, q: "Google ek search engine hai - True ya False?", options: ["True", "False", "Maybe", "Not sure"], ans: "True", cat: "BCA Basics", difficulty: "easy" },
  { id: 49, q: "Paani se fish rehti hai - True ya False?", options: ["True", "False", "Maybe", "Not sure"], ans: "True", cat: "Science", difficulty: "easy" },
  { id: 50, q: "Math ka opposite subject kya hai?", options: ["Science", "English", "Hindi", "Art"], ans: "Art", cat: "English", difficulty: "easy" },
  
  // MEDIUM Questions (50+)
  { id: 51, q: "15% of 200 kya hoga?", options: ["20", "25", "30", "35"], ans: "30", cat: "Math", difficulty: "medium" },
  { id: 52, q: "DNA ka full form kya hai?", options: ["Deoxyribonucleic Acid", "Digital Nuclear Array", "Data Number Array", "Digital Network Array"], ans: "Deoxyribonucleic Acid", cat: "Science", difficulty: "medium" },
  { id: 53, q: "Logic mein 'AND' operator ka result kya hota hai agar dono false hain?", options: ["True", "False", "Maybe", "Error"], ans: "False", cat: "Reasoning", difficulty: "medium" },
  { id: 54, q: "Carbon ke kitne valence electrons hain?", options: ["2", "4", "6", "8"], ans: "4", cat: "Science", difficulty: "medium" },
  { id: 55, q: "Delhi India ka capital hai - True ya False?", options: ["True", "False", "Maybe", "Not sure"], ans: "True", cat: "Geography", difficulty: "medium" },
  { id: 56, q: "अगर A=1, B=2, C=3 है तो D=?", options: ["4", "5", "3", "2"], ans: "4", cat: "Reasoning", difficulty: "medium" },
  { id: 57, q: "Mitochondria ko cell ka kya kahte hain?", options: ["Brain", "Heart", "Powerhouse", "Kidney"], ans: "Powerhouse", cat: "Science", difficulty: "medium" },
  { id: 58, q: "Speed = ?", options: ["Distance × Time", "Distance ÷ Time", "Time ÷ Distance", "Time × Distance"], ans: "Distance ÷ Time", cat: "Math", difficulty: "medium" },
  { id: 59, q: "'Benevolent' word ka antonym kya hoga?", options: ["Generous", "Kind", "Malevolent", "Good"], ans: "Malevolent", cat: "English", difficulty: "medium" },
  { id: 60, q: "Square ke kitne equal angles hote hain?", options: ["2", "3", "4", "0"], ans: "4", cat: "Math", difficulty: "medium" },
  { id: 61, q: "Photosynthesis me kaun sa gas release hoti hai?", options: ["CO2", "O2", "N2", "H2"], ans: "O2", cat: "Science", difficulty: "medium" },
  { id: 62, q: "Prime number kya hota hai?", options: ["Even number", "Odd number", "Only 1 aur khud se divisible", "Always even"], ans: "Only 1 aur khud se divisible", cat: "Math", difficulty: "medium" },
  { id: 63, q: "Array ek kya hota hai?", options: ["Function", "Variable", "Data structure", "Operator"], ans: "Data structure", cat: "BCA Basics", difficulty: "medium" },
  { id: 64, q: "Gravity Earth mein hota hai - True ya False?", options: ["True", "False", "Maybe", "Not sure"], ans: "True", cat: "Science", difficulty: "medium" },
  { id: 65, q: "Internet ka invention kaun ne kiya?", options: ["Steve Jobs", "Bill Gates", "Tim Berners-Lee", "Elon Musk"], ans: "Tim Berners-Lee", cat: "BCA Basics", difficulty: "medium" },
  { id: 66, q: "Triangle mein kitne sides hote hain?", options: ["2", "3", "4", "5"], ans: "3", cat: "Math", difficulty: "medium" },
  { id: 67, q: "Electricity ek energy form hai - True ya False?", options: ["True", "False", "Maybe", "Not sure"], ans: "True", cat: "Science", difficulty: "medium" },
  { id: 68, q: "Function call करने से पहले क्या जरूरी है?", options: ["Declaration", "Definition", "Return statement", "Dono A aur B"], ans: "Declaration", cat: "BCA Basics", difficulty: "medium" },
  { id: 69, q: "Velocity mein direction hota hai - True ya False?", options: ["True", "False", "Maybe", "Not sure"], ans: "True", cat: "Science", difficulty: "medium" },
  { id: 70, q: "25 ka square root kya hota hai?", options: ["4", "5", "6", "7"], ans: "5", cat: "Math", difficulty: "medium" },
  { id: 71, q: "Synonyms ka matlab kya hota hai?", options: ["Opposite words", "Same meaning words", "Different words", "Similar sounding"], ans: "Same meaning words", cat: "English", difficulty: "medium" },
  { id: 72, q: "Loop programming mein kya hota hai?", options: ["Jump", "Repeat", "Skip", "Delete"], ans: "Repeat", cat: "BCA Basics", difficulty: "medium" },
  { id: 73, q: "Photon ek kya hota hai?", options: ["Wave", "Particle", "Dono A aur B", "Gas"], ans: "Dono A aur B", cat: "Science", difficulty: "medium" },
  { id: 74, q: "Percentage nikalne ka formula kya hai?", options: ["(Part/Whole)×100", "(Whole/Part)×100", "Part+Whole", "Part-Whole"], ans: "(Part/Whole)×100", cat: "Math", difficulty: "medium" },
  { id: 75, q: "Variable name me special characters use ho sakte hain - True ya False?", options: ["True", "False", "Maybe", "Not sure"], ans: "False", cat: "BCA Basics", difficulty: "medium" },
  { id: 76, q: "Atomic number atom mein protons ki count hoti hai - True ya False?", options: ["True", "False", "Maybe", "Not sure"], ans: "True", cat: "Science", difficulty: "medium" },
  { id: 77, q: "Decimal number 10 ka binary kya hota hai?", options: ["1000", "1010", "1100", "1110"], ans: "1010", cat: "Math", difficulty: "medium" },
  { id: 78, q: "If statement ka use programming mein kya hota hai?", options: ["Condition check", "Loop", "Function", "Variable"], ans: "Condition check", cat: "BCA Basics", difficulty: "medium" },
  { id: 79, q: "Reflection light ke basis par hota hai - True ya False?", options: ["True", "False", "Maybe", "Not sure"], ans: "True", cat: "Science", difficulty: "medium" },
  { id: 80, q: "Two squares se jo combined shape banti hai uska name kya hai?", options: ["Rectangle", "Hexagon", "Pentagon", "Rhombus"], ans: "Rectangle", cat: "Math", difficulty: "medium" },
  { id: 81, q: "Consonant kya hote hain?", options: ["All letters", "Vowels", "Non-vowel letters", "Numbers"], ans: "Non-vowel letters", cat: "English", difficulty: "medium" },
  { id: 82, q: "Queue ek FIFO structure hai - True ya False?", options: ["True", "False", "Maybe", "Not sure"], ans: "True", cat: "BCA Basics", difficulty: "medium" },
  { id: 83, q: "Salt namak se banti hai - True ya False?", options: ["True", "False", "Maybe", "Not sure"], ans: "True", cat: "Science", difficulty: "medium" },
  { id: 84, q: "Algebra mein 'x' ek kya hota hai?", options: ["Number", "Variable", "Operator", "Function"], ans: "Variable", cat: "Math", difficulty: "medium" },
  { id: 85, q: "Adverb kya modify karta hai?", options: ["Noun", "Verb", "Adjective", "All"], ans: "Verb", cat: "English", difficulty: "medium" },
  { id: 86, q: "Cache memory speed mein kaun se type ki memory fastest hoti hai?", options: ["RAM", "ROM", "Cache", "Hard disk"], ans: "Cache", cat: "BCA Basics", difficulty: "medium" },
  { id: 87, q: "Thermometer se temperature measure hota hai - True ya False?", options: ["True", "False", "Maybe", "Not sure"], ans: "True", cat: "Science", difficulty: "medium" },
  { id: 88, q: "Fibonacci series mein pehle do numbers kaun se hote hain?", options: ["0,1", "1,1", "1,2", "2,3"], ans: "0,1", cat: "Math", difficulty: "medium" },
  { id: 89, q: "Preposition word ka position sentence mein kya hota hai?", options: ["Start", "Middle", "End", "Anywhere"], ans: "Start", cat: "English", difficulty: "medium" },
  { id: 90, q: "Stack ek LIFO structure hai - True ya False?", options: ["True", "False", "Maybe", "Not sure"], ans: "True", cat: "BCA Basics", difficulty: "medium" },
  { id: 91, q: "Magnet iron ko attract karta hai - True ya False?", options: ["True", "False", "Maybe", "Not sure"], ans: "True", cat: "Science", difficulty: "medium" },
  { id: 92, q: "LCM kya hota hai?", options: ["Least Common Multiple", "Large Common Multiple", "Lower Common Multiple", "Linear Common Multiple"], ans: "Least Common Multiple", cat: "Math", difficulty: "medium" },
  { id: 93, q: "Plural of 'child' kya hota hai?", options: ["Childs", "Children", "Childes", "Childr"], ans: "Children", cat: "English", difficulty: "medium" },
  { id: 94, q: "Compiler program ko kya convert karta hai?", options: ["Machine code", "Object code", "Source code", "Byte code"], ans: "Machine code", cat: "BCA Basics", difficulty: "medium" },
  { id: 95, q: "Enzyme protein hote hain - True ya False?", options: ["True", "False", "Maybe", "Not sure"], ans: "True", cat: "Science", difficulty: "medium" },
  { id: 96, q: "Median ek kya hota hai?", options: ["Average", "Middle value", "Highest value", "Lowest value"], ans: "Middle value", cat: "Math", difficulty: "medium" },
  { id: 97, q: "Article 'a' aur 'an' mein difference kya hai?", options: ["Vowel/Consonant", "Singular/Plural", "Male/Female", "None"], ans: "Vowel/Consonant", cat: "English", difficulty: "medium" },
  { id: 98, q: "Pointer variable kya store karta hai?", options: ["Value", "Address", "Type", "Name"], ans: "Address", cat: "BCA Basics", difficulty: "medium" },
  { id: 99, q: "Chlorophyll plants ko kaun sa color deta hai?", options: ["Red", "Green", "Yellow", "Blue"], ans: "Green", cat: "Science", difficulty: "medium" },
  { id: 100, q: "Ratio aur Proportion mein kya difference hai?", options: ["Same thing", "Ratio = part of Proportion", "No difference", "Not related"], ans: "Ratio = part of Proportion", cat: "Math", difficulty: "medium" },

  // HARD Questions (50+)
  { id: 101, q: "Integration ke baad derivative nikaalne ko kya kehte hain?", options: ["Differentiation", "Fundamental Theorem", "Integration Rule", "Inversion"], ans: "Fundamental Theorem", cat: "Math", difficulty: "hard" },
  { id: 102, q: "Quantum mechanics mein Heisenberg Uncertainty Principle kya kahte hai?", options: ["Measure ho sakte hain", "Measure nahi ho sakte", "Only position ho sakta hai", "Only momentum"], ans: "Measure nahi ho sakte", cat: "Science", difficulty: "hard" },
  { id: 103, q: "String 'HELLO' ko reverse karne se kya milega?", options: ["HELLO", "OLLEH", "ELLOH", "LOHEL"], ans: "OLLEH", cat: "BCA Basics", difficulty: "hard" },
  { id: 104, q: "Binary number 1010 ka decimal equivalent kya hoga?", options: ["8", "10", "12", "14"], ans: "10", cat: "BCA Basics", difficulty: "hard" },
  { id: 105, q: "Democracy mein sab se important kya hota hai?", options: ["King", "Government", "People's Vote", "Military"], ans: "People's Vote", cat: "Reasoning", difficulty: "hard" },
  { id: 106, q: "Protein synthesis ke liye DNA ke baad kaun transcribe karta hai?", options: ["DNA", "RNA", "tRNA", "Protein"], ans: "RNA", cat: "Science", difficulty: "hard" },
  { id: 107, q: "If a:b = 3:4 aur b:c = 5:6, toh a:c kya hoga?", options: ["15:24", "10:24", "3:6", "5:6"], ans: "15:24", cat: "Math", difficulty: "hard" },
  { id: 108, q: "'Serendipity' ka definition kya hota hai?", options: ["Bad luck", "Good luck by chance", "Planned success", "Failure"], ans: "Good luck by chance", cat: "English", difficulty: "hard" },
  { id: 109, q: "Algorithm ka time complexity Big O notation se kaise compare karte hain?", options: ["Space usage", "Speed", "Memory", "Input size"], ans: "Speed", cat: "BCA Basics", difficulty: "hard" },
  { id: 110, q: "Calculus mein 'Limit' concept kya hota hai?", options: ["Maximum value", "Value function approach karta hai", "Minimum value", "Average value"], ans: "Value function approach karta hai", cat: "Math", difficulty: "hard" },
  { id: 111, q: "Relativity theory Einstein ne kab propose ki?", options: ["1905", "1915", "1925", "1935"], ans: "1905", cat: "Science", difficulty: "hard" },
  { id: 112, q: "Sorting algorithm mein Quick Sort ka complexity kya hota hai?", options: ["O(n)", "O(n log n)", "O(n²)", "O(log n)"], ans: "O(n log n)", cat: "BCA Basics", difficulty: "hard" },
  { id: 113, q: "Photosynthesis ka equation kya hota hai?", options: ["CO2+H2O+Light→Glucose+O2", "Glucose+O2→CO2+H2O", "O2+Glucose→Light+H2O", "H2O→O2+Glucose"], ans: "CO2+H2O+Light→Glucose+O2", cat: "Science", difficulty: "hard" },
  { id: 114, q: "Polynomial degree 3 ko kya kehte hain?", options: ["Linear", "Quadratic", "Cubic", "Quartic"], ans: "Cubic", cat: "Math", difficulty: "hard" },
  { id: 115, q: "Object-Oriented Programming mein Encapsulation kya hota hai?", options: ["Grouping", "Hiding data", "Inheritance", "Polymorphism"], ans: "Hiding data", cat: "BCA Basics", difficulty: "hard" },
  { id: 116, q: "Entropy concept thermodynamics ke baad important kya ban gaya?", options: ["Physics", "Chemistry", "Information theory", "All"], ans: "Information theory", cat: "Science", difficulty: "hard" },
  { id: 117, q: "Logarithm log₁₀(100) ka value kya hota hai?", options: ["1", "2", "3", "10"], ans: "2", cat: "Math", difficulty: "hard" },
  { id: 118, q: "Inheritance programming mein parent class se kya mila jata hai?", options: ["Methods", "Properties", "Dono A aur B", "Functions"], ans: "Dono A aur B", cat: "BCA Basics", difficulty: "hard" },
  { id: 119, q: "Photon ki energy formula kya hota hai?", options: ["E=mc²", "E=hf", "E=½mv²", "E=kT"], ans: "E=hf", cat: "Science", difficulty: "hard" },
  { id: 120, q: "Set theory mein Union aur Intersection mein kya difference hai?", options: ["Same", "Union add karta hai, Intersection common nikalta hai", "Opposite", "No difference"], ans: "Union add karta hai, Intersection common nikalta hai", cat: "Math", difficulty: "hard" },
  { id: 121, q: "Recursion ek function ko kya allow karta hai?", options: ["Call itself", "Call other functions", "Call main function", "No calling"], ans: "Call itself", cat: "BCA Basics", difficulty: "hard" },
  { id: 122, q: "DNA structure ki shape kaun si hoti hai?", options: ["Linear", "Circular", "Double Helix", "Star"], ans: "Double Helix", cat: "Science", difficulty: "hard" },
  { id: 123, q: "Matrix multiplication mein condition kya hoti hai?", options: ["Equal size", "Column of 1st = Row of 2nd", "Square matrices", "Same dimensions"], ans: "Column of 1st = Row of 2nd", cat: "Math", difficulty: "hard" },
  { id: 124, q: "API ka full form kya hai?", options: ["Application Programming Interface", "Advanced Program Integration", "Application Protocol Interface", "All"], ans: "Application Programming Interface", cat: "BCA Basics", difficulty: "hard" },
  { id: 125, q: "Evolution theory Darwin ne kab propose ki?", options: ["1859", "1869", "1879", "1889"], ans: "1859", cat: "Science", difficulty: "hard" },
  { id: 126, q: "Trigonometry mein sin(90°) ka value kya hota hai?", options: ["0", "0.5", "1", "-1"], ans: "1", cat: "Math", difficulty: "hard" },
  { id: 127, q: "Database mein Primary Key ka purpose kya hota hai?", options: ["Access speed", "Unique identification", "Storage", "Backup"], ans: "Unique identification", cat: "BCA Basics", difficulty: "hard" },
  { id: 128, q: "Chromosome ke mein kya hote hain?", options: ["Proteins", "RNA", "DNA", "Lipids"], ans: "DNA", cat: "Science", difficulty: "hard" },
  { id: 129, q: "Complex number 'i' ka value kya hota hai?", options: ["1", "-1", "√-1", "0"], ans: "√-1", cat: "Math", difficulty: "hard" },
  { id: 130, q: "Class aur Object mein kya difference hai?", options: ["Same", "Class = Template, Object = Instance", "Opposite", "No difference"], ans: "Class = Template, Object = Instance", cat: "BCA Basics", difficulty: "hard" },
  { id: 131, q: "Mitosis se kitne daughter cells bante hain?", options: ["1", "2", "3", "4"], ans: "2", cat: "Science", difficulty: "hard" },
  { id: 132, q: "Probability formula basic kya hota hai?", options: ["Favorable/Total", "Total/Favorable", "Favorable-Total", "Favorable+Total"], ans: "Favorable/Total", cat: "Math", difficulty: "hard" },
  { id: 133, q: "Hash function ka use data structures mein kya hota hai?", options: ["Sorting", "Searching fast", "Deletion", "Addition"], ans: "Searching fast", cat: "BCA Basics", difficulty: "hard" },
  { id: 134, q: "Osmosis process mein kya happen hota hai?", options: ["Water movement", "Salt movement", "Gas movement", "Light movement"], ans: "Water movement", cat: "Science", difficulty: "hard" },
  { id: 135, q: "Vector ek kya hota hai?", options: ["Scalar", "Magnitude aur direction dono", "Only magnitude", "Only direction"], ans: "Magnitude aur direction dono", cat: "Math", difficulty: "hard" },
  { id: 136, q: "Binary Search Tree (BST) mein Left subtree ke elements kaun se hote hain?", options: ["Greater", "Smaller", "Equal", "Random"], ans: "Smaller", cat: "BCA Basics", difficulty: "hard" },
  { id: 137, q: "Immune system body ko kya protect karta hai?", options: ["Injury", "Disease", "Cold", "All"], ans: "All", cat: "Science", difficulty: "hard" },
  { id: 138, q: "Determinant ek mathematical concept kya represent karta hai?", options: ["Area/Volume", "Speed", "Distance", "Time"], ans: "Area/Volume", cat: "Math", difficulty: "hard" },
  { id: 139, q: "Deadlock programming mein kya occur hota hai?", options: ["Slow execution", "Resources blocked", "Memory error", "Type error"], ans: "Resources blocked", cat: "BCA Basics", difficulty: "hard" },
  { id: 140, q: "Respiration process mein Glucose se kya produce hota hai?", options: ["Oxygen", "ATP", "Protein", "Lipid"], ans: "ATP", cat: "Science", difficulty: "hard" },
  { id: 141, q: "Fourier Transform mein domain change hota hai kya se kya?", options: ["Time to Space", "Time to Frequency", "Frequency to Space", "Space to Time"], ans: "Time to Frequency", cat: "Math", difficulty: "hard" },
  { id: 142, q: "Normalization database mein kya achieve karta hai?", options: ["Speed", "Data redundancy remove", "Backup", "Compression"], ans: "Data redundancy remove", cat: "BCA Basics", difficulty: "hard" },
  { id: 143, q: "Meiosis mein kaun sa process hoti hai?", options: ["Duplication", "Reduction", "Multiplication", "Division"], ans: "Reduction", cat: "Science", difficulty: "hard" },
  { id: 144, q: "Eigenvalue concept linear algebra mein kaun se problem solve karta hai?", options: ["Rotation", "Transformation", "Scaling", "All"], ans: "All", cat: "Math", difficulty: "hard" },
  { id: 145, q: "Garbage Collection programming mein kya memory free karta hai?", options: ["Used memory", "Unused memory", "All memory", "Cache"], ans: "Unused memory", cat: "BCA Basics", difficulty: "hard" },
  { id: 146, q: "Photosynthesis mein light-dependent reaction kaha hota hai?", options: ["Stroma", "Thylakoid", "Cytoplasm", "Nucleus"], ans: "Thylakoid", cat: "Science", difficulty: "hard" },
  { id: 147, q: "Series convergence test mein kaun sa method use hota hai?", options: ["Root", "Ratio", "Both A and B", "None"], ans: "Both A and B", cat: "Math", difficulty: "hard" },
  { id: 148, q: "Thread programming mein synchronization kya prevent karta hai?", options: ["Deadlock", "Race condition", "Both A and B", "Cache"], ans: "Both A and B", cat: "BCA Basics", difficulty: "hard" },
  { id: 149, q: "Gene mutation biological level par kya cause karta hai?", options: ["Growth", "Variation", "Reproduction", "Death"], ans: "Variation", cat: "Science", difficulty: "hard" },
  { id: 150, q: "Topology mein property preserved rehti hai kya se kya?", options: ["Distance", "Angle", "Continuity", "Length"], ans: "Continuity", cat: "Math", difficulty: "hard" },
];

export default function QuizGame({ user, userData, onUpdateCoins, onBackToDashboard }: QuizGameProps) {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [coins, setCoins] = useState(userData.coins);
  const [correctCount, setCorrectCount] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [isFinished, setIsFinished] = useState(false);
  const [loading, setLoading] = useState(true);
  const [usedQuestionIds, setUsedQuestionIds] = useState<Set<number>>(new Set());

  // Get difficulty and question count based on coins
  const getDifficulty = (): 'easy' | 'medium' | 'hard' => {
    if (userData.coins >= 300) return 'hard';
    if (userData.coins >= 100) return 'medium';
    return 'easy';
  };

  const getQuestionCount = (): number => {
    if (userData.coins >= 300) return 20;
    if (userData.coins >= 200) return 15;
    if (userData.coins >= 100) return 10;
    return 5;
  };

  const getLevelFromCoins = (totalCoins: number): number => {
    return Math.floor(totalCoins / 100) + 1;
  };

  // Shuffle array helper
  const shuffleArray = <T,>(arr: T[]): T[] => {
    const newArr = [...arr];
    for (let i = newArr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [newArr[i], newArr[j]] = [newArr[j], newArr[i]];
    }
    return newArr;
  };

  useEffect(() => {
    const difficulty = getDifficulty();
    const count = getQuestionCount();
    
    // Get all questions of selected difficulty
    const filtered = QUESTION_BANK.filter(q => q.difficulty === difficulty);
    
    // Shuffle and take required number (avoiding repeats if possible)
    const shuffled = shuffleArray(filtered).slice(0, count);
    
    setQuestions(shuffled);
    setUsedQuestionIds(new Set(shuffled.map(q => q.id)));
    setLoading(false);
  }, []);

  const handleAnswer = (selected: string) => {
    setSelectedAnswer(selected);
    setShowResult(true);

    if (selected === questions[currentIdx].ans) {
      setCoins(prev => prev + 2);
      setCorrectCount(prev => prev + 1);
    }
  };

  const handleNext = () => {
    if (currentIdx + 1 < questions.length) {
      setCurrentIdx(prev => prev + 1);
      setSelectedAnswer(null);
      setShowResult(false);
    } else {
      finishGame();
    }
  };

  const finishGame = () => {
    let totalCoins = coins;
    let newLevel = userData.level;

    // Bonus for all correct
    if (correctCount === questions.length) {
      totalCoins += 10;
    }

    // Calculate new level based on total coins
    newLevel = getLevelFromCoins(totalCoins);

    onUpdateCoins(totalCoins, newLevel);
    setIsFinished(true);
  };

  if (loading) {
    return <div className="min-h-screen w-full bg-gradient-to-br from-slate-950 via-purple-900 to-slate-950 flex items-center justify-center text-white text-xl sm:text-2xl">🎮 Loading Game...</div>;
  }

  return (
    <div className="w-screen h-screen bg-gradient-to-br from-slate-950 via-purple-900 to-slate-950 text-white overflow-y-auto">
      <div className="min-h-screen w-full flex flex-col items-center px-4 sm:px-6 md:px-8 py-6">
        {!isFinished ? (
          <div className="w-full max-w-3xl">
          {/* Game Header */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 sm:mb-8 gap-4">
            <div className="flex gap-2 sm:gap-4 w-full sm:w-auto">
              <div className="bg-yellow-600/30 border border-yellow-500 rounded-xl px-3 sm:px-4 py-2 flex-1 sm:flex-initial">
                <p className="text-xs text-gray-300">Coins</p>
                <p className="text-xl sm:text-2xl font-black text-yellow-400">💰 {coins}</p>
              </div>
              <div className="bg-purple-600/30 border border-purple-500 rounded-xl px-3 sm:px-4 py-2 flex-1 sm:flex-initial">
                <p className="text-xs text-gray-300">Correct</p>
                <p className="text-xl sm:text-2xl font-black text-purple-400">{correctCount}/{questions.length}</p>
              </div>
            </div>
            <button
              onClick={onBackToDashboard}
              className="bg-red-600 hover:bg-red-700 px-6 py-2 rounded-xl font-bold transition-all w-full sm:w-auto"
            >
              Exit Game
            </button>
          </div>

          {/* Progress Bar */}
          <div className="w-full bg-slate-800 h-2 sm:h-3 rounded-full overflow-hidden mb-6 sm:mb-8">
            <div
              className="bg-gradient-to-r from-purple-500 to-pink-500 h-full transition-all duration-300"
              style={{ width: `${((currentIdx + 1) / questions.length) * 100}%` }}
            ></div>
          </div>

          {/* Question Card */}
          <div className="bg-slate-900/80 border border-purple-500/30 rounded-xl sm:rounded-2xl p-4 sm:p-8 mb-6 sm:mb-8 backdrop-blur-sm">
            <div className="mb-4 sm:mb-6">
              <span className="inline-block bg-blue-600/30 border border-blue-500 text-blue-300 text-xs font-bold px-3 py-1 rounded-lg mb-3 sm:mb-4">
                {questions[currentIdx].cat} • Question {currentIdx + 1}/{questions.length}
              </span>
              <h2 className="text-xl sm:text-3xl font-bold leading-relaxed min-h-[60px] sm:min-h-[80px]">
                {questions[currentIdx].q}
              </h2>
            </div>

            {/* Options */}
            <div className="grid grid-cols-1 gap-2 sm:gap-3">
              {questions[currentIdx].options.map((opt, i) => (
                <button
                  key={i}
                  onClick={() => !showResult && handleAnswer(opt)}
                  disabled={showResult}
                  className={`w-full p-3 sm:p-4 text-left rounded-xl font-bold transition-all transform text-sm sm:text-base ${
                    selectedAnswer === opt
                      ? opt === questions[currentIdx].ans
                        ? 'bg-green-600 border-2 border-green-400 scale-105'
                        : 'bg-red-600 border-2 border-red-400 scale-105'
                      : showResult && opt === questions[currentIdx].ans
                      ? 'bg-green-600 border-2 border-green-400'
                      : 'bg-slate-800 hover:bg-slate-700 border border-slate-700 hover:border-purple-500'
                  } ${showResult ? 'cursor-not-allowed' : 'hover:scale-105 active:scale-95'}`}
                >
                  {opt}
                </button>
              ))}
            </div>
          </div>

          {/* Result & Next Button */}
          {showResult && (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-300">
              <div className={`mb-4 p-4 rounded-xl font-bold text-center ${
                selectedAnswer === questions[currentIdx].ans
                  ? 'bg-green-600/30 border border-green-500 text-green-300'
                  : 'bg-red-600/30 border border-red-500 text-red-300'
              }`}>
                {selectedAnswer === questions[currentIdx].ans
                  ? '✅ Correct! +2 coins'
                  : `❌ Wrong! Correct answer: ${questions[currentIdx].ans}`}
              </div>
              <button
                onClick={handleNext}
                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-black py-3 rounded-xl transition-all transform hover:scale-105 active:scale-95"
              >
                {currentIdx + 1 === questions.length ? '🏁 Finish Game' : '➡️ Next Question'}
              </button>
            </div>
          )}
        </div>
      ) : (
        <div className="w-full max-w-md text-center animate-in zoom-in duration-500 mt-20">
          <div className="text-8xl mb-6">🏆</div>
          <h1 className="text-5xl font-black text-white mb-4">GAME OVER!</h1>
          
          <div className="bg-slate-900/80 border border-purple-500/30 rounded-2xl p-8 mb-8">
            <p className="text-gray-400 text-lg mb-6">Final Score</p>
            <div className="space-y-4 mb-6">
              <div className="flex justify-between items-center">
                <span className="text-gray-300">💰 Total Coins:</span>
                <span className="text-3xl font-black text-yellow-400">{coins}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-300">✅ Correct Answers:</span>
                <span className="text-3xl font-black text-green-400">{correctCount}/{questions.length}</span>
              </div>
              {correctCount === questions.length && (
                <div className="flex justify-between items-center bg-green-600/30 p-3 rounded-lg border border-green-500">
                  <span className="text-gray-300">🎁 Perfect Bonus:</span>
                  <span className="text-3xl font-black text-green-400">+10</span>
                </div>
              )}
            </div>

            {coins >= 100 && (
              <div className="bg-purple-600/30 border border-purple-500 p-4 rounded-lg mb-4">
                <p className="text-purple-300 font-bold">🔥 Level {Math.floor(coins / 100) + 1} Unlocked! Hard Mode Available!</p>
              </div>
            )}
          </div>

          <div className="space-y-3">
            <button
              onClick={() => window.location.reload()}
              className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-black py-4 rounded-2xl transition-all transform hover:scale-105 active:scale-95"
            >
              🎮 PLAY AGAIN
            </button>
            <button
              onClick={onBackToDashboard}
              className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-black py-4 rounded-2xl transition-all transform hover:scale-105 active:scale-95"
            >
              📊 BACK TO DASHBOARD
            </button>
          </div>
        </div>
      )}
      </div>
    </div>
  );
}
