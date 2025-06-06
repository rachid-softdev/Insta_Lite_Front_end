import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { SelectivePreloadingStrategyService } from '../../core/services/preloading/selective-preloading-strategy.service';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.scss'],
})
export class AdminComponent implements OnInit, OnDestroy {
  sessionId!: Observable<string>;
  token!: Observable<string>;
  modules: string[] = [];

  constructor(private route: ActivatedRoute, preloadStrategy: SelectivePreloadingStrategyService) {
    this.modules = preloadStrategy.preloadedModules;
  }

  ngOnInit(): void {
    // Capture the session ID if available
    this.sessionId = this.route.queryParamMap.pipe(map((params) => params.get('session_id') || 'None'));
    // Capture the fragment if available
    this.token = this.route.fragment.pipe(map((fragment) => fragment || 'None'));
  }

  ngOnDestroy(): void {}
}
