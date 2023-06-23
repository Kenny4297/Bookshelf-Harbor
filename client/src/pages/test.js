const cutOffAtSpecialCharacter = (text) => {
    if (!text) {
      return '';
    }
  
    const specialCharacters = ['{', '[', '(', '-'];
    let pos = text.length;
    let consecutiveDashesCount = 0;
  
    for (let i = 0; i < text.length; i++) {
      const char = text[i];
  
      if (specialCharacters.includes(char) && i < pos) {
        if (char === '-') {
          consecutiveDashesCount++;
          console.log(consecutiveDashesCount);
          if (consecutiveDashesCount >= 3) {
            pos = i - 2; // Remove the last two dashes
            break;
          }
        } else {
          pos = i;
          break;
        }
      } else {
        consecutiveDashesCount = 0; // Reset consecutive dashes count for other characters
        console.log("resetting the consec?")
      }
    }
  
    if (pos !== -1) {
      return text.slice(0, pos).trim();
    }
  
    return text.trim();
  };
  

  let text =`"Command the murderous chalices! Drink ye harpooners! Drink and swear, ye men that man the deathful whaleboat's bow -- Death to Moby Dick!" So Captain Ahab binds his crew to fulfil his obsession -- the destruction of the great white whale. Under his lordly but maniacal command the Pequod's commercial mission is perverted to one of vengeance. To Ahab, the monster that destroyed his body is not a creature, but the symbol of "some unknown but still reasoning thing." Uncowed by natural disasters, ill omens, even death, Ahab urges his ship towards "the undeliverable, nameless perils of the whale." Key letters from Melville to Nathaniel Hawthorne are printed at the end of this volume. - Back cover.`


  console.log(cutOffAtSpecialCharacter(text))
  