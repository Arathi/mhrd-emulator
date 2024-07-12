grammar MHRD;

component
    : inputs outputs parts wires EOF
    ;

// Inputs:
inputs
    : INPUTS input_port (CM input_port)* SC
    ;

input_port
    : input_pin
    | input_bus
    ;

input_pin
    : pin_define
    ;

input_bus
    : bus_define
    ;

// Outputs:
outputs
    : OUTPUTS output_port (CM output_port)* SC
    ;

output_port
    : output_pin
    | output_bus
    ;

output_pin
    : pin_define
    ;

output_bus
    : bus_define
    ;

// Parts:
parts
    : PARTS part_define (CM part_define)* SC
    ;

part_define
    : part_name component_name
    ;

// Wires:
wires
    : WIRES wire_define (CM wire_define)* SC
    ;

wire_define
    : pin_wire_define
    | bus_wires_define
    ;

pin_wire_define
    : pin_src TO pin_dest
    ;

bus_wires_define
    : bus_src TO bus_dest
    ;

pin_src
    : value
    | pin_name
    | bus_name LB pin_index RB
    | part_name DT pin_name
    | part_name DT bus_name LB pin_index RB
    ;

pin_dest
    : pin_name
    | bus_name LB pin_index RB
    | part_name DT pin_name
    | part_name DT bus_name LB pin_index RB
    ;

bus_src
    : bus_name
    | bus_name LB pin_start CL pin_end RB
    | part_name DT bus_name
    | part_name DT bus_name LB pin_start CL pin_end RB
    ;

bus_dest
    : bus_name
    | bus_name LB pin_start CL pin_end RB
    | part_name DT bus_name
    | part_name DT bus_name LB pin_start CL pin_end RB
    ;

// commons
pin_define
    : pin_name
    ;

bus_define
    : bus_name LB pin_amount RB
    ;

pin_start
    : pin_index
    ;

pin_end
    : pin_index
    ;

// pattern
pin_name: IDENTIFIER;
bus_name: IDENTIFIER;
pin_amount: NUMBER;
part_name: IDENTIFIER;
component_name: COMPONENT;
value: NUMBER;
pin_index: NUMBER;

// ------------ Lexer -------------

INPUTS: 'Inputs:';
OUTPUTS: 'Outputs:';
PARTS: 'Parts:';
WIRES: 'Wires:';

CM: ',';
CL: ':';
SC: ';';
LB: '[';
RB: ']';
TO: '->';
DT: '.';

IDENTIFIER: [a-z] [0-9A-Za-z]*;
COMPONENT: [A-Z] [0-9A-Z]*;
NUMBER: [0-9]+;

COMMENT: '//' [\u0020-\u007e]* -> skip;
WS: [ \r\n\t] -> skip;
