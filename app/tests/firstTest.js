describe("A suite", function() {
  it("contains spec with an expectation", function() {
    expect(true).toBe(true);
  });
});


/**
 * used by the simple tiles tests with editMode toggle
 * and swipe the edit toggle mode with two different tile modes
 * @type {{w: number, h: number, link: string, icon: string, label: string, color: string, uuid: string}[]}
 */
window.testerUnitDefaultTile = [
    {"w":2,"h":1,"link":"http://maps.google.com","icon":"googleplaces","label":"Maps","color":"blue","uuid":"1f51d649-11fb-96ce-2576-8631195c3273"},
    {"w":2,"h":1,"link":"http://maps.google.com","icon":"googleplaces","label":"Maps","color":"blue","uuid":"1f51d649-11fb-96ce-2576-8631195c3271"}
];