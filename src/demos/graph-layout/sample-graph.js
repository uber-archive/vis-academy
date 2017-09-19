const SAMPLE_GRAPH = {
  nodes: [
    {id: '0'},
    {id: '1'},
    {id: '2'},
    {id: '3'},
    {id: '4'},
    {id: '5'}
  ],
  edges: [
    {id: '0', source: '0', target: '1'},
    {id: '1', source: '0', target: '3'},
    {id: '1', source: '1', target: '2'},
    {id: '2', source: '1', target: '3'},
    {id: '2', source: '1', target: '4'},
    {id: '3', source: '2', target: '4'},
    {id: '4', source: '2', target: '5'},
    {id: '4', source: '3', target: '4'},
    {id: '5', source: '3', target: '5'}
  ]
};

export default SAMPLE_GRAPH;
