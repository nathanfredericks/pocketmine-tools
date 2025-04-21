import React from 'react';
import { Table } from 'react-bootstrap';
import Check from 'bootstrap-icons/icons/check.svg';
import X from 'bootstrap-icons/icons/x.svg';
export default function FileStructTable({ exTitles }) {
  return (
    <Table responsive bordered>
      {exTitles ? (
        <thead>
          <tr>
            <th className="text-center">Example 1</th>
            <th className="text-center">Example 2</th>
            <th className="text-center">Example 3</th>
            <th className="text-center">Example 4</th>
          </tr>
        </thead>
      ) : null}
      <tbody>
        <tr>
          <td>
            DevTools-master.zip
            <br />
            &nbsp;&nbsp;ⳑ src
            <br />
            &nbsp;&nbsp;ⳑ plugin.yml
          </td>
          <td>
            DevTools-master.zip
            <br />
            &nbsp;&nbsp;ⳑ DevTools-master
            <br />
            &nbsp;&nbsp;&nbsp;&nbsp;ⳑ src
            <br />
            &nbsp;&nbsp;&nbsp;&nbsp;ⳑ plugin.yml
          </td>
          <td>
            DevTools-master.zip
            <br />
            &nbsp;&nbsp;ⳑ DevTools-master
            <br />
            &nbsp;&nbsp;&nbsp;&nbsp;ⳑ{' '}
            <span className="text-bg-danger text-white">OtherFolder</span>
            <br />
            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;ⳑ src
            <br />
            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;ⳑ plugin.yml
          </td>
          <td>
            DevTools-master.zip
            <br />
            &nbsp;&nbsp;ⳑ DevTools-
            <span className="text-bg-danger text-white">other</span>
            <br />
            &nbsp;&nbsp;&nbsp;&nbsp;ⳑ src
            <br />
            &nbsp;&nbsp;&nbsp;&nbsp;ⳑ plugin.yml
          </td>
        </tr>
        <tr>
          <td className="text-center text-success">
            Valid <Check width="1.25em" height="1.25em" />
          </td>
          <td className="text-center text-success">
            Valid <Check width="1.25em" height="1.25em" />
          </td>
          <td className="text-center text-danger">
            Invalid <X width="1.25em" height="1.25em" />
          </td>
          <td className="text-center text-danger">
            Invalid <X width="1.25em" height="1.25em" />
          </td>
        </tr>
      </tbody>
    </Table>
  );
}
