// Function to parse the code and substitute variables
function parseCode(code, data) {
    code = replaceEntitiesWithCharacters(code)
    // Helper function to get words from a string
    function getWords(str) {
      return str.split(' ');
    }
  
    // Helper function to generate a random integer between min and max (inclusive)
    function randomInt(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    // Helper function to generate a random number between min and max (inclusive)
    function randomNumber(min, max) {
        // Check if min and max are numbers or number of digits
        const isDigits = (value) => typeof value === 'string' && value.endsWith('d');
        const isNumber = (value) => !isNaN(value) && !isDigits(`${value}`)
        
        if (isNumber(min) && isNumber(max)) {
          // Generate random number within the specified range
          return randomInt(parseInt(min), parseInt(max)).toString();

        } else if (isDigits(min) && isDigits(max)) {
          // Parse number of digits from min and max
          const minDigits = parseInt(min);
          const maxDigits = parseInt(max);
      
          // Generate a random number with a random number of digits between minDigits and maxDigits
          let result = '';
          let currentDigits = 0;

          const numOfDigits = randomInt(minDigits, maxDigits)
      
          while (currentDigits < numOfDigits) {
            const num = randomInt(1, 9); // Ensure the first digit is not zero
            result += num.toString();
            currentDigits = result.length;
          }
      
          return result;
        } else if (isDigits(min)) {
          // Generate a number with exactly min digits
          const minDigits = parseInt(min);
          let result = '';
      
          for (let i = 0; i < minDigits; i++) {
            const num = randomInt(0, 9); // Include zero as a possible digit
            result += num.toString();
          }
      
          return result;
        } else if (isNumber(min)) {
    
            return Math.round(Math.random() * parseInt(min));
        } else {
          // Invalid input scenario
          throw new Error('Invalid arguments for randomNumber function: ' + `Min: ${min} - ${typeof min} | Max: ${max} - ${typeof max}`);
        }
    }
  
    // Helper function to handle variable substitution
    function substituteVariable(key) {
        key = key.replace(/[{}]+/g, "")
      // Check if the variable has a word slice
      const wordSliceMatch = key.match(/(.+)\[w(\d+)\]/);
      if (wordSliceMatch) {
        const [, baseKey, wordIndex] = wordSliceMatch;
        const words = getWords(data[baseKey] || '');
        return words[parseInt(wordIndex) - 1] || '';
      } else if (key in data) {
        return data[key];
      }
      return '';
    }
  
    function extractVariables(code) {
      const regex = /{([^{}]+?)}(\.\w+\[(.*?)\])?/g;
      const results = [];
      let match;
  
        while ((match = regex.exec(code)) !== null) {
            const varKey = match[1];
            const varFunc = match[2] ? match[2].split('[')[0].slice(1) : null;
            const varFuncArgs = match[3] ? match[3].split(',').map(arg => arg.trim()) : [];
    
            const replacementStart = match.index;
            const replacementEnd = match.index + match[0].length - 1;
    
            results.push({
                varKey,
                varFunc: varFunc || undefined,
                varFuncArgs: varFuncArgs.length ? varFuncArgs : undefined,
                replacementStart,
                replacementEnd
            });
        }
    
        return results;
    }

    function replaceSubtext(text, replacementText, start, end) {
      // Extract the parts
      const before = text.slice(0, start);
      const after = text.slice(end + 1);
  
      // Construct the new text
      return before + replacementText + after;
    }

    function callVarFunc (variable, varFunc, varFuncArgs) {
      var result = null
      switch (varFunc) {
        case "cut":
          if(varFuncArgs && varFuncArgs.length == 2) {
            try {
              var var1 = parseInt(varFuncArgs[0])
              var var2 = parseInt(varFuncArgs[1])

              result = variable.substring(var1 - 1, var2)

            } catch(e) {}
          }
          break;
      
        default:
          break;
      }

      return result

    }
  
    // Replace variables and handle special syntax
    const repList = []
    let intermediateResult = code.replace(/\(([^()]*)\)/g, (match, p1) => {
      // Check for special syntax within parentheses
      if (p1.startsWith("rn[")) {
        // Random number generation
        const [min, max] = p1.slice(3, -1).split(',');
        return randomNumber(min, max);
      } else if (p1.match(/^([^*]+)(\*{1,2})(\d+)$/)) {
        // Fixed count repetition
        const [, char, operand, count] = p1.match(/^([^*]+)(\*{1,2})(\d+)$/);
        const total = parseInt(count)
        //repeat until the chars is the number of count
        if(operand == "*") {
            var reps = char.repeat(total)
            return reps;

        } //repeat until the whole generated text length is the number of count
        else {
            const repId = `<${randomInt(10000000, 9999999999)}>`
            const rep = {
                id: repId,
                char, count
            }
            repList.push(rep)
            return repId
        }
      } else if(p1.includes("{") && p1.includes("}")) {
        // Variable substitution
        //'abc{var}ghi', 'abc{var}', '{var}'
        var p1CodeExtraction = extractVariables(p1)

        // Sort the extractions in reverse order of `replacementStart` to avoid position shifting during replacemen
        p1CodeExtraction.sort((a, b) => b.replacementStart - a.replacementStart);

        for(const extraction of p1CodeExtraction) {
          var variable = substituteVariable(extraction.varKey)
          if(extraction.varFunc) {
            variable = callVarFunc(variable, extraction.varFunc, extraction.varFuncArgs)
          }

          if(variable && p1.length > 0) {
            p1 = replaceSubtext(p1, variable, extraction.replacementStart, extraction.replacementEnd)

          } else {
            p1 = ""
            break
          }
        }
        
        return p1;

      } else {
        return p1
      }
    })

    for ( const rep of repList) {
        const textLength = (intermediateResult.length - rep.id.length)
        if(textLength >= rep.count) {
            break
        }
        var reps = rep.char.repeat(rep.count - textLength)
        intermediateResult = intermediateResult.replace(rep.id, reps)
    }
  
    return intermediateResult;
}