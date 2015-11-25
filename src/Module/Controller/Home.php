<?php
/**
 * Verone CRM | http://www.veronecrm.com
 *
 * @copyright  Copyright (C) 2015 Adam Banaszkiewicz
 * @license    GNU General Public License version 3; see license.txt
 */

namespace App\Module\Home\Controller;

use CRM\App\Controller\BaseController;

class Home extends BaseController
{
  public function indexAction($request)
  {
    return $this->render('', [
      'widgetsPositions' => $this->openSettings('user')->get('mod.home.widgets.json')
    ]);
  }

  /**
   * Array look:
   * [
   *   'options' => [
   *     [
   *       'id'    => 'widget-1',
   *       'style' => 'some-style,
   *     ],
   *     [
   *       'id'    => 'widget-2',
   *       'style' => 'some-style,
   *     ]
   *   ],
   *   'sizes' => [
   *     [
   *       'width' => 1680,
   *       'data'  => [
   *         [
   *           'id'  => 'widget-1',
   *           'col' => 1,
   *           'row' => 1,
   *           'x'   => 1,
   *           'y'   => 1
   *         ],
   *         [
   *           'id'  => 'widget-2',
   *           'col' => 1,
   *           'row' => 1,
   *           'x'   => 1,
   *           'y'   => 1
   *         ]
   *       ]
   *     ]
   *   ]
   * ]
   */
  public function saveWidgetsPositionsAction($request)
  {
    $settings = $this->openSettings('user');
    $current  = json_decode($settings->get('mod.home.widgets.json'), true);
    $source   = json_decode($request->get('widgets'), true);



    /**
     * First- we create array of widgets, with their options (like color).
     */
    $options = [];

    foreach($source as $widget)
    {
      $options[] = [
        'id'    => $widget['id'],
        'style' => $widget['style']
      ];
    }


    /**
     * Now, we create array of positions and sizes of widgets
     * in current page width.
     */
    $sizes = [];

    foreach($source as $widget)
    {
      $sizes[] = [
        'id'  => $widget['id'],
        'col' => $widget['col'],
        'row' => $widget['row'],
        'x'   => $widget['x'],
        'y'   => $widget['y']
      ];
    }


    /**
     * Comprarision of current saved data. If does not exists, we append new data.
     */
    $isset = false;

    if(isset($current['sizes']))
    {
      foreach($current['sizes'] as $key => $item)
      {
        if($item['width'] == $request->get('width'))
        {
          $current['sizes'][$key]['data'] = $sizes;
          $isset = true;
        }
      }
    }

    if($isset === false)
    {
      $current['sizes'][] = [
        'width' => $request->get('width'),
        'data'  => $sizes
      ];
    }


    /**
     * Update widgets styles.
     */
    $current['options'] = $options;

    $settings->set('mod.home.widgets.json', json_encode($current));

    return $this->responseAJAX([ 'status' => 'success', 'message' => $this->t('homeWidgetsSaved') ]);
  }

  public function pingAction()
  {
    return $this->responseAJAX([ 'status' => 'success', 'message' => $this->t('sessionRefreshed') ]);
  }

  /**
   * Check if given password is the same as password in current logged user.
   * This method is here instead of User Module, because to User module we can have denied access
   * for some users.
   */
  public function validateUserPasswordAction($request)
  {
    $status = $this->user()->passwordMatch($request->get('password')) ? 'success' : 'error';

    return $this->responseAJAX([ 'status' => $status, 'message' => '', 'data' => $status ]);
  }
}
