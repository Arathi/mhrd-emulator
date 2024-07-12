grammar MHDL;

component
    : inputs outputs parts wires EOF
    ;

inputs
    : inputsStart declarePort (CM declarePort)* CM? SC
    ;

outputs
    : outputsStart declarePort (CM declarePort)* CM? SC
    ;

parts
    : partsStart declarePart (CM declarePart)* CM? SC
    ;

wires
    : wiresStart declareWire (CM declareWire)* CM? SC
    ;

declarePort
    : declarePin
    | declareBus
    ;

declarePart
    : partName partType
    ;

declareWire
    : declarePinToPin
    | declareBusToBus
    ;

declarePinToPin: pinSrc TO pinDest;
declareBusToBus: busSrc TO busDest;

pinSrc
    : bit
    | pinEndpoint
    ;

pinDest
    : pinEndpoint
    ;

busSrc
    : busEndpoint
    ;

busDest
    : busEndpoint
    ;

pinEndpoint
    : endpointPin
    | endpointBusPin
    | endpointPartPin
    | endpointPartBusPin
    ;

busEndpoint
    : endpointBus
    | endpointSubBus
    | endpointPartBus
    | endpointPartSubBus
    ;

endpointPin
    : pinName
    ;

endpointBusPin
    : busName LB pinIndex RB
    ;

endpointPartPin
    : partName DT pinName
    ;

endpointPartBusPin
    : partName DT busName LB pinIndex RB
    ;

endpointBus
    : busName
    ;

endpointSubBus
    : busName LB pinIndexStart CL pinIndexEnd RB
    ;

endpointPartBus
    : partName DT busName
    ;

endpointPartSubBus
    : partName DT busName LB pinIndexStart CL pinIndexEnd RB
    ;

declarePin
    : pinName
    | busName LB pinIndex RB
    ;

declareBus
    : busName LB pinAmount RB
    | busName LB pinIndexStart CL pinIndexEnd RB
    ;

inputsStart: INPUTS CL;
outputsStart: OUTPUTS CL;
partsStart: PARTS CL;
wiresStart: WIRES CL;

pinIndexStart: pinIndex;
pinIndexEnd: pinIndex;

pinAmount: NUMBER;
pinName: LOWERCASE_NAME;
busName: LOWERCASE_NAME;
pinIndex: NUMBER;
partName: LOWERCASE_NAME;
partType: UPPERCASE_NAME;
bit: BIT;

// ----------

CM: ',';
CL: ':';
SC: ';';
LP: '(';
RP: ')';
LB: '[';
RB: ']';
DT: '.';
TO: '->';

INPUTS: 'inputs' | 'Inputs';
OUTPUTS: 'outputs' | 'Outputs';
PARTS: 'parts' | 'Parts';
WIRES: 'wires' | 'Wires';

LOWERCASE_NAME: LOWERCASE_CHAR IDENTIFIER_CHAR*;
UPPERCASE_NAME: UPPERCASE_CHAR IDENTIFIER_CHAR*;
NUMBER: DIGIT+;
BIT: BINARY_DIGIT;

COMMENT: '//' PRINTABLE* -> skip;
WS: [ \r\n\t]+ -> skip;

fragment UPPERCASE_CHAR: [A-Z];
fragment LOWERCASE_CHAR: [a-z];
fragment IDENTIFIER_CHAR: [0-9A-Z_a-z];
fragment DIGIT: [0-9];
fragment PRINTABLE: [\u0020-\u007e];
fragment BINARY_DIGIT: [01];
