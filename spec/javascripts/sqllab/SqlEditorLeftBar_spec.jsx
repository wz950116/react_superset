import React from 'react';
import { mount } from 'enzyme';
import { describe, it } from 'mocha';
import { expect } from 'chai';

import { table, defaultQueryEditor } from './fixtures';
import SqlEditorLeftBar from '../../../javascripts/SqlLab/components/SqlEditorLeftBar';
import TableElement from '../../../javascripts/SqlLab/components/TableElement';


describe('SqlEditorLeftBar', () => {
  const mockedProps = {
    tables: [table],
    queryEditor: defaultQueryEditor,
  };
  it('is valid', () => {
    expect(
      React.isValidElement(<SqlEditorLeftBar {...mockedProps} />),
    ).to.equal(true);
  });
  it('renders a TableElement', () => {
    const wrapper = mount(<SqlEditorLeftBar {...mockedProps} />);
    expect(wrapper.find(TableElement)).to.have.length(1);
  });
});
