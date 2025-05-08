import React from 'react';
import PropTypes from 'prop-types';

const FormattedText = ({ 
  text, 
  paragraphTag: Paragraph = 'p', 
  preserveWhitespace = false,
  tabSpaces = 4,
  className = ''
}) => {
  // Replace tabs with specified spaces
  const processedText = text.replace(/\t/g, ' '.repeat(tabSpaces));

  // Split into paragraphs by double newlines
  const paragraphs = processedText.split(/\n\s*\n/);

  return (
    <div className={`formatted-text ${className}`}>
      {paragraphs.map((paragraph, i) => (
        <React.Fragment key={i}>
          {i > 0 && <br />} {/* Add space between paragraphs */}
          <Paragraph 
            style={preserveWhitespace ? { whiteSpace: 'pre-wrap' } : {}}
          >
            {paragraph.split('\n').map((line, j, lines) => (
              <React.Fragment key={j}>
                {line}
                {j < lines.length - 1 && <br />}
              </React.Fragment>
            ))}
          </Paragraph>
        </React.Fragment>
      ))}
    </div>
  );
};

FormattedText.propTypes = {
  text: PropTypes.string.isRequired,
  paragraphTag: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.elementType
  ]),
  preserveWhitespace: PropTypes.bool,
  tabSpaces: PropTypes.number,
  className: PropTypes.string
};

export default FormattedText;