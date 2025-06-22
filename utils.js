exports.generateRandomString = (length) => {
    const characters = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let result = '';
    for (let i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return result;
}


// {
//     "success": true,
//     "message": {
//         "WATER": [
//             {
//                 "topic": "Water Chemistry",
//                 "question": "What is the chemical formula for water?",
//                 "options": [
//                     "A. CO2",
//                     "B. H2O",
//                     "C. NaCl",
//                     "D. O2"
//                 ],
//                 "answer": "B"
//             },
//             {
//                 "topic": "Water Cycle",
//                 "question": "Which process in the water cycle involves water turning from a gas to a liquid?",
//                 "options": [
//                     "A. Evaporation",
//                     "B. Condensation",
//                     "C. Precipitation",
//                     "D. Transpiration"
//                 ],
//                 "answer": "B"
//             },
//             {
//                 "topic": "Water Pollution",
//                 "question": "Which of the following is a major source of water pollution?",
//                 "options": [
//                     "A. Rainwater",
//                     "B. Industrial waste",
//                     "C. Clean air",
//                     "D. Photosynthesis"
//                 ],
//                 "answer": "B"
//             },
//             {
//                 "topic": "Water Management",
//                 "question": "What is water conservation?",
//                 "options": [
//                     "A. Wasting water resources",
//                     "B. The responsible use and management of water resources",
//                     "C. The process of polluting water sources",
//                     "D. The study of water chemistry"
//                 ],
//                 "answer": "B"
//             },
//             {
//                 "topic": "Water Chemistry",
//                 "question": "Which of the following is a measure of water acidity or alkalinity?",
//                 "options": [
//                     "A. Salinity",
//                     "B. pH",
//                     "C. Turbidity",
//                     "D. Temperature"
//                 ],
//                 "answer": "B"
//             },
//             {
//                 "topic": "Water Cycle",
//                 "question": "What is the name of the process where water vapor is released from plants?",
//                 "options": [
//                     "A. Infiltration",
//                     "B. Runoff",
//                     "C. Transpiration",
//                     "D. Sublimation"
//                 ],
//                 "answer": "C"
//             },
//             {
//                 "topic": "Water Pollution",
//                 "question": "Eutrophication is caused by:",
//                 "options": [
//                     "A. Lack of oxygen",
//                     "B. Excess nutrients",
//                     "C. Volcanic eruptions",
//                     "D. Saltwater intrusion"
//                 ],
//                 "answer": "B"
//             },
//             {
//                 "topic": "Water Management",
//                 "question": "What is a common method for water purification?",
//                 "options": [
//                     "A. Adding salt",
//                     "B. Boiling",
//                     "C. Freezing",
//                     "D. Mixing with sand"
//                 ],
//                 "answer": "B"
//             },
//             {
//                 "topic": "Water Pollution",
//                 "question": "What is a major concern related to plastic pollution in water bodies?",
//                 "options": [
//                     "A. Increased water clarity",
//                     "B. Harm to marine life",
//                     "C. Improved water taste",
//                     "D. Reduced water evaporation"
//                 ],
//                 "answer": "B"
//             },
//             {
//                 "topic": "Water Management",
//                 "question": "What is greywater?",
//                 "options": [
//                     "A. Water from toilets",
//                     "B. Clean drinking water",
//                     "C. Wastewater from showers and sinks",
//                     "D. Water from rivers"
//                 ],
//                 "answer": "C"
//             }
//         ]
//     }
// }
