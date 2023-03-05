import React, { Component } from 'react';
import Layout from '../components/Layout';
import { Badge, Table } from 'react-bootstrap';
import Check from 'bootstrap-icons/icons/check.svg';
export default class Home extends Component {
  render = () => (
    <Layout title={null}>
      <h1>Welcome to PocketMine Tools!</h1>
      <p>
        PocketMine Tools is a website for PocketMine-MP server owners and plugin
        owners. It offers multiple tools and services to make running your
        server easier. Since PocketMine Tools was released in 2017, many new
        features have been added to help plugin developers and server owners
        alike. New versions of PocketMine Tools do all plugin conversion locally
        in the browser. This means your plugin never leaves your device. Some
        benefits to this are: saved bandwidth, faster speeds, and no worries
        about who has your plugin.
      </p>
      <h2>Compare versions</h2>
      <p>
        In most cases, v3 will be sufficient. However on older devices, it may
        be better to use an older version.{' '}
      </p>
      <Table responsive="md" className="text-center">
        <thead>
          <tr>
            <th style={{ width: '34%' }}></th>
            <th style={{ width: '22%' }}>
              <a
                href="https://v1.mcpe.fun"
                target="_blank"
                rel="noreferrer"
              >
                Old PMT
              </a>
            </th>
            <th style={{ width: '22%' }}>
              <a href="https://v2.mcpe.fun" target="_blank" rel="noreferrer">
                v2
              </a>
            </th>
            <th style={{ width: '22%' }}>v3</th>
          </tr>
        </thead>

        <tbody>
          <tr>
            <th scope="row" className="text-start">
              Make <code>.phar</code>
            </th>
            <td>
              <Check width="24" height="24" />
            </td>
            <td>
              <Check width="24" height="24" />
            </td>
            <td>
              <Check width="24" height="24" />
            </td>
          </tr>
          <tr>
            <th scope="row" className="text-start">
              Extract <code>.phar</code>
            </th>
            <td>
              <Check width="24" height="24" />
            </td>
            <td>
              <Check width="24" height="24" />
            </td>
            <td>
              <Check width="24" height="24" />
            </td>
          </tr>
          <tr>
            <th scope="row" className="text-start">
              API Injector
            </th>
            <td>
              <Check width="24" height="24" />
            </td>
            <td>
              <Check width="24" height="24" />
            </td>
            <td>
              <Check width="24" height="24" />
            </td>
          </tr>
          <tr>
            <th scope="row" className="text-start">
              Poggit Search
            </th>
            <td></td>
            <td>
              <Check width="24" height="24" />
            </td>
            <td>
              <Check width="24" height="24" />
              <Badge bg="secondary">Updated!</Badge>
            </td>
          </tr>
          <tr>
            <th scope="row" className="text-start">
              MOTD Generator
            </th>
            <td></td>
            <td>
              <Check width="24" height="24" />
            </td>
            <td>
              <Check width="24" height="24" />
              <Badge bg="secondary">Updated!</Badge>
            </td>
          </tr>
          <tr>
            <th scope="row" className="text-start">
              Crashdump Parser
            </th>
            <td></td>
            <td>
              <Check width="24" height="24" />
            </td>
            <td>
              <Check width="24" height="24" />
              <Badge bg="secondary">Updated!</Badge>
            </td>
          </tr>
          <tr>
            <th scope="row" className="text-start">
              Decode <code>.pmf</code>
            </th>
            <td></td>
            <td>
              <Check width="24" height="24" />
            </td>
            <td>
              <Check width="24" height="24" />
            </td>
          </tr>
          <tr>
            <th scope="row" className="text-start">
              Plugin creator
            </th>
            <td>
              <Check width="24" height="24" />
            </td>
            <td></td>
            <td></td>
          </tr>
          <tr>
            <th scope="row" className="text-start">
              Generate skeleton plugin
            </th>
            <td></td>
            <td></td>
            <td>
              {' '}
              <Check width="24" height="24" />
              <Badge bg="secondary">New!</Badge>
            </td>
          </tr>
          <tr>
            <th scope="row" className="text-start">
              Dark mode
            </th>
            <td></td>
            <td></td>
            <td>
              <Check width="24" height="24" />
              <Badge bg="secondary">New!</Badge>
            </td>
          </tr>
        </tbody>
      </Table>
    </Layout>
  );
}
