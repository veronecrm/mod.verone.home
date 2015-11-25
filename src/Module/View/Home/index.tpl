<?php
  $app->assetter()->load([
    'files' => [
      'css' => [ '{ASSETS}/gridster.js/jquery.gridster.min.css', '{ROOT}/modules/Home/style.css' ],
      'js'  => [ '{ASSETS}/gridster.js/jquery.gridster.min.js', '{ROOT}/modules/Home/script.js' ]
    ]
  ]);
?>
<div class="homepage-tiles">
  <?php
    $tileDefaults = [
      'color'   => 'tile-info',
      'icon'    => '',
      'heading' => '',
      'value'   => '',
      'footer'  => '',
    ];
  ?>
  @foreach $app->callPlugins('HomeTiles', 'tilesGet') as $tiles
    @if is_array($tiles)
      @foreach $tiles as $tile
        <?php $tile = array_merge($tileDefaults, $tile); ?>
        <div class="tile-wrap" data-sizex="1">
          <div class="info-tile {{ $tile['color'] }}">
            @if $tile['icon']
              <div class="icon">{{ $tile['icon']|raw }}</div>
            @endif
            @if $tile['heading']
              <div class="heading">{{ $tile['heading']|raw }}</div>
            @endif
            @if $tile['value']
              <div class="body">{{ $tile['value']|raw }}</div>
            @endif
            @if $tile['footer']
              <div class="footer">{{ $tile['footer']|raw }}</div>
            @endif
          </div>
        </div>
      @endforeach
    @endif
  @endforeach
  <hr />
</div>
<div class="gridster homepage-widgets" style="opacity:0">
  <ul>
    @foreach $app->callPlugins('HomeWidgets', 'widgetsGet') as $widgets
      @foreach $widgets as $widget
        <li class="widget" id="{{ $widget['id'] }}">
          {{ $widget['content']|raw }}
        </li>
      @endforeach
    @endforeach
  </ul>
</div>
<div class="modal fade" id="widget-edit" tabindex="-1" role="dialog" aria-labelledby="widget-edit-modal-label" aria-hidden="true">
  <div class="modal-dialog">
    <div class="modal-content">
      <div class="modal-header">
        <button type="button" class="close" data-dismiss="modal" aria-label="<?php echo $app->t('close'); ?>"><span aria-hidden="true">&times;</span></button>
        <h4 class="modal-title" id="widget-edit-modal-label">Zmień widget</h4>
      </div>
      <div class="modal-body">
        <h5>Kolor widgetu</h5>
        <div class="widget-colors">
          <div class="widget-base"></div>
          <div class="widget-primary"></div>
          <div class="widget-success"></div>
          <div class="widget-warning"></div>
          <div class="widget-danger"></div>
          <div class="widget-secondary"></div>
          <div class="widget-info"></div>
        </div>
      </div>
      <div class="modal-footer">
        <button type="button" class="btn btn-default btn-cancel" data-dismiss="modal"><?php echo $app->t('close'); ?></button>
        <a href="#" class="btn btn-primary btn-save"><?php echo $app->t('save'); ?></a>
      </div>
    </div>
  </div>
</div>
<script>
  var widgetsPositionsSource = <?php echo $widgetsPositions ? $widgetsPositions : '{}'; ?>;
</script>
