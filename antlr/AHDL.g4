grammar AHDL;

components: component* EOF;

component
    : COMPONENT componentName inputs GT outputs LC parts RC
    ;

componentName: UPPER_NAME;

LP: '(';
LB: '[';
LC: '{';

RP: ')';
RB: ']';
RC: '}';

GT: '>';

COMPONENT: 'component';

UPPER_NAME: [A-Z] [0-9A-Za-z_]*;
LOWER_NAME: [a-z] [0-9A-Za-z_]*;
