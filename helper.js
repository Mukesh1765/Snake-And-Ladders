const getElementById = (element, attributes = {}) => {
  const el = document.getElementById(element);
  if (!el) return null;

  for (const [key, value] of Object.entries(attributes)) {
    el.setAttribute(key, value);
  }

  return el;
}

const getElementsByClassName = (className, attributes = {}) => {
  const elements = document.getElementsByClassName(className);
  if (!elements) return [];

  Array.from(elements).forEach(el => {
    for (const [key, value] of Object.entries(attributes)) {
      el.setAttribute(key, value);
    }
  });

  return elements;
}

const getElementsByTagName = (tagName, attributes = {}) => {
  const elements = document.getElementsByTagName(tagName);
  if (!elements) return [];

  Array.from(elements).forEach(el => {
    for (const [key, value] of Object.entries(attributes)) {
      el.setAttribute(key, value);
    }
  });

  return elements;
}

const toggleVisibility = (element, visibility = true) => {
  const el = typeof element === 'string' ? document.getElementById(element) : element;
  if (el) {
    el.style.visibility = visibility ? 'visible' : 'hidden';
  }
}

const toggleDisplay = (element, display = 'block') => {
  const el = typeof element === 'string' ? document.getElementById(element) : element;
  if (el) {
    el.style.display = display === 'none' ? 'none' : display;
  }
}

const toggleCursor = (element, cursorStyle = 'pointer') => {
    const el = typeof element === 'string' ? document.getElementById(element) : element;
    if (el) {
        el.style.cursor = cursorStyle;
    }
}

const toggleFilter = (element, filterStyle = 'none') => {
    const el = typeof element === 'string' ? document.getElementById(element) : element;
    if (el) {
        el.style.filter = filterStyle;
    }
}

const setTextContent = (element, text) => {
    const el = typeof element === 'string' ? document.getElementById(element) : element;
    if (el) {
        el.textContent = text;
    }
}

const getFormDetails = (formId) => {
    const form = document.getElementById(formId);
    if (form) {
        const formData = new FormData(form);
        const details = {};
        for (const [key, value] of formData.entries()) {
            details[key] = value;
        }
        return details;
    }
    return null;
}

const getDuration = (ladders, snakes, move, diceNumber, position) => {
    let duration = move[diceNumber - 1] || 350;
    const newPosition = position + diceNumber;
    
    if (newPosition <= 100) {
        if (ladders && ladders[newPosition]) {
            duration += ladders[newPosition];
        } else if (snakes && snakes[newPosition]) {
            duration += snakes[newPosition];
        }
    }
    
    return duration;
}

function Color(starColor, circleColor) {
    let _starColor = starColor;
    let _circleColor = circleColor;

    return {
        getStarColor: () => _starColor,
        getCircleColor: () => _circleColor,
        setStarColor: (color) => { _starColor = color; },
        setCircleColor: (color) => { _circleColor = color; }
    };
}

function Position(x, y) {
    let _x = x;
    let _y = y;

    return {
        getX: () => _x,
        getY: () => _y,
        setX: (x) => { _x = x; },
        setY: (y) => { _y = y; }
    };
}

function Person(name, x, y, starColor, circleColor, place = 0) {
    let _name = name;
    let _position = Position(x, y);
    let _color = Color(starColor, circleColor);
    let _place = place;

    return {
        getName: () => _name,
        getPosition: () => _position,
        getColor: () => _color,
        setPosition: (x, y) => {
            if (typeof x === 'object' && x.x !== undefined && x.y !== undefined) {
                _position.setX(x.x);
                _position.setY(x.y);
            } else {
                _position.setX(x);
                _position.setY(y);
            }
        },
        getPlace: () => _place,
        setPlace: (place) => { 
            if (place >= 1 && place <= 100) {
                _place = place;
            }
        },
        setName: (name) => { _name = name; }
    };
}

const renderIconImage = (src) => {
    const div = document.createElement('div');
    div.style.setProperty('--bg-url', `url("${src}")`);
    div.classList.add('iconClass');
    return div;
};

const validatePlayer = (player) => {
    if (!player) return false;
    
    try {
        const name = player.getName();
        const position = player.getPosition();
        const color = player.getColor();
        const place = player.getPlace();
        
        return name && 
               position && 
               typeof position.getX === 'function' && 
               typeof position.getY === 'function' &&
               color && 
               typeof color.getStarColor === 'function' && 
               typeof color.getCircleColor === 'function' &&
               place >= 0 && place <= 100;
    } catch (error) {
        return false;
    }
};

const clonePlayer = (player) => {
    if (!validatePlayer(player)) return null;
    
    const pos = player.getPosition();
    const color = player.getColor();
    
    return Person(
        player.getName(),
        pos.getX(),
        pos.getY(),
        color.getStarColor(),
        color.getCircleColor(),
        player.getPlace()
    );
};

export {
  getElementById,
  getElementsByClassName,
  getElementsByTagName,
  toggleVisibility,
  toggleDisplay,
  setTextContent,
  toggleCursor,
  toggleFilter,
  getFormDetails,
  getDuration,
  Person,
  renderIconImage,
  validatePlayer,
  clonePlayer
};