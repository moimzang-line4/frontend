/*
 * 컴퓨터 네트워크 프로그래밍 과제 #1
 * 그림 2 그래프에서 모든 노드 쌍의 최단 거리와 "최단 경로 전부(Equal Cost 포함)"를
 * Bellman-Ford / Dijkstra / Floyd-Warshall 세 가지 알고리즘으로 구한다.
 *
 * 그래프 표현: 2차원 배열(인접 행렬)
 * 같은 비용의 경로를 모두 찾기 위해, 각 알고리즘이
 *   - Bellman-Ford, Dijkstra : 노드마다 "직전 노드 집합(pred)"을 비트마스크로 기록
 *   - Floyd-Warshall         : (i, j)마다 "첫 번째로 가는 노드 집합(next)"을 비트마스크로 기록
 * 하고, 마지막에 이 집합을 따라가며 경로를 전부 출력한다.
 *
 * 실행: shortest_path        → 주어진 가중치로 실행
 *       shortest_path 1      → 모든 거리를 1로 바꿔 실행 (검증용)
 * 화면 출력과 같은 내용이 result.txt 에도 저장된다 (보고서용).
 */
#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <stdarg.h>
#ifdef _WIN32
#include <windows.h>
#endif

#define N 7          /* 노드 수 (1 ~ 7) */
#define INF 1000000  /* 연결 없음 */

typedef unsigned int Mask; /* bit k = 노드 k+1 */

static int cost[N][N];     /* 인접 행렬. cost[i][j] == INF 이면 간선 없음 */
static FILE *out;          /* 결과 파일 */

/* 화면과 파일에 동시에 출력 */
static void say(const char *fmt, ...)
{
    va_list ap;
    va_start(ap, fmt);
    vprintf(fmt, ap);
    va_end(ap);
    if (out) {
        va_start(ap, fmt);
        vfprintf(out, fmt, ap);
        va_end(ap);
    }
}

/* ---------------------------------------------------------------- 그래프 */

static void add_edge(int a, int b, int w)
{
    cost[a - 1][b - 1] = w;
    cost[b - 1][a - 1] = w; /* d_ij = d_ji */
}

static void build_graph(int all_one)
{
    /* 그림 2: { 노드a, 노드b, 거리 } */
    static const int edges[][3] = {
        {1, 2, 4}, {1, 3, 5}, {2, 3, 6}, {2, 4, 5}, {2, 5, 10}, {3, 4, 4},
        {3, 6, 9}, {4, 5, 6}, {4, 6, 3}, {5, 6, 3}, {5, 7, 2}, {6, 7, 2},
    };
    int i, j;
    for (i = 0; i < N; i++)
        for (j = 0; j < N; j++)
            cost[i][j] = (i == j) ? 0 : INF;
    for (i = 0; i < (int)(sizeof edges / sizeof edges[0]); i++)
        add_edge(edges[i][0], edges[i][1], all_one ? 1 : edges[i][2]);
}

static int has_edge(int a, int b) { return a != b && cost[a][b] < INF; }

/* ------------------------------------------------------------ 경로 출력 */

static int path_buf[N];

/* pred[v] 를 거꾸로 따라가며 src → ... → v 경로를 모두 출력 (Bellman-Ford, Dijkstra) */
static void print_paths_by_pred(const Mask pred[N], int src, int v, int depth)
{
    int u, k;
    path_buf[depth] = v;
    if (v == src) {
        say("\t\t* ");
        for (k = depth; k >= 0; k--)
            say("%d%s", path_buf[k] + 1, k ? " -> " : "\n");
        return;
    }
    for (u = 0; u < N; u++)
        if (pred[v] & (1u << u))
            print_paths_by_pred(pred, src, u, depth + 1);
}

/* next[i][j] 를 앞에서부터 따라가며 i → ... → dst 경로를 모두 출력 (Floyd-Warshall) */
static void print_paths_by_next(Mask next[N][N], int i, int dst, int depth)
{
    int h, k;
    path_buf[depth] = i;
    if (i == dst) {
        say("\t\t* ");
        for (k = 0; k <= depth; k++)
            say("%d%s", path_buf[k] + 1, k < depth ? " -> " : "\n");
        return;
    }
    for (h = 0; h < N; h++)
        if (next[i][dst] & (1u << h))
            print_paths_by_next(next, h, dst, depth + 1);
}

static void print_header(int src)
{
    say("\n<<<------------- 노드 %d ------------->>>\n", src + 1);
}

static void print_target(int src, int dst, int d)
{
    if (d >= INF) say("[ %d -> %d ], cost : 도달 불가\n", src + 1, dst + 1);
    else say("[ %d -> %d ], cost : %d\n", src + 1, dst + 1, d);
}

/* ------------------------------------------------------- Bellman-Ford */

/*
 * 모든 간선을 최대 N-1번 반복해서 완화(relax)한다.
 *   dist[u] + w <  dist[v] → 더 짧은 길 발견: dist 갱신, pred[v] = {u}
 *   dist[u] + w == dist[v] → 같은 비용의 다른 길: pred[v] 에 u 추가
 */
static void bellman_ford(int src, int dist[N], Mask pred[N])
{
    int i, u, v, round, changed;
    for (i = 0; i < N; i++) { dist[i] = INF; pred[i] = 0; }
    dist[src] = 0;

    for (round = 1; round < N; round++) {
        changed = 0;
        for (u = 0; u < N; u++) {
            if (dist[u] >= INF) continue;
            for (v = 0; v < N; v++) {
                int nd;
                if (!has_edge(u, v)) continue;
                nd = dist[u] + cost[u][v];
                if (nd < dist[v]) {
                    dist[v] = nd;
                    pred[v] = 1u << u;
                    changed = 1;
                } else if (nd == dist[v] && !(pred[v] & (1u << u))) {
                    pred[v] |= 1u << u;
                    changed = 1;
                }
            }
        }
        if (!changed) break; /* 더 이상 바뀌지 않으면 조기 종료 */
    }
}

/* ----------------------------------------------------------- Dijkstra */

/*
 * 아직 확정되지 않은 노드 중 거리가 가장 짧은 노드를 하나씩 확정하고,
 * 그 노드에서 나가는 간선으로 이웃 거리를 갱신한다 (같은 비용이면 pred 추가).
 */
static void dijkstra(int src, int dist[N], Mask pred[N])
{
    int done[N] = {0};
    int i, step, u, v;
    for (i = 0; i < N; i++) { dist[i] = INF; pred[i] = 0; }
    dist[src] = 0;

    for (step = 0; step < N; step++) {
        u = -1;
        for (i = 0; i < N; i++)
            if (!done[i] && dist[i] < INF && (u < 0 || dist[i] < dist[u])) u = i;
        if (u < 0) break; /* 남은 노드는 도달 불가 */
        done[u] = 1;

        for (v = 0; v < N; v++) {
            int nd;
            if (done[v] || !has_edge(u, v)) continue;
            nd = dist[u] + cost[u][v];
            if (nd < dist[v]) {
                dist[v] = nd;
                pred[v] = 1u << u;
            } else if (nd == dist[v]) {
                pred[v] |= 1u << u;
            }
        }
    }
}

/* ----------------------------------------------------- Floyd-Warshall */

/*
 * 경유 노드 k 를 하나씩 늘려 가며 모든 (i, j) 쌍을 갱신한다.
 *   d[i][k] + d[k][j] <  d[i][j] → d 갱신, next[i][j] = next[i][k]
 *   d[i][k] + d[k][j] == d[i][j] → 같은 비용: next[i][j] 에 next[i][k] 추가
 * next[i][j] = i 에서 j 로 가는 최단 경로들의 "첫 번째 다음 노드" 집합
 */
static void floyd_warshall(int d[N][N], Mask next[N][N])
{
    int i, j, k;
    for (i = 0; i < N; i++)
        for (j = 0; j < N; j++) {
            d[i][j] = cost[i][j];
            next[i][j] = has_edge(i, j) ? (1u << j) : 0;
        }

    for (k = 0; k < N; k++)
        for (i = 0; i < N; i++)
            for (j = 0; j < N; j++) {
                int nd;
                if (i == j || i == k || j == k) continue;
                if (d[i][k] >= INF || d[k][j] >= INF) continue;
                nd = d[i][k] + d[k][j];
                if (nd < d[i][j]) {
                    d[i][j] = nd;
                    next[i][j] = next[i][k];
                } else if (nd == d[i][j]) {
                    next[i][j] |= next[i][k];
                }
            }
}

/* 거리 행렬 출력 (Floyd 실행 전/후 확인용) */
static void print_matrix(const char *title, int d[N][N])
{
    int i, j;
    say("\n<----------- %s ----------->\n     ", title);
    for (j = 0; j < N; j++) say("%5d", j + 1);
    say("\n");
    for (i = 0; i < N; i++) {
        say("%5d", i + 1);
        for (j = 0; j < N; j++) {
            if (d[i][j] >= INF) say("%5s", "INF");
            else say("%5d", d[i][j]);
        }
        say("\n");
    }
}

/* --------------------------------------------------------------- main */

static void run_single_source(const char *name, void (*algo)(int, int[N], Mask[N]))
{
    int src, dst, dist[N];
    Mask pred[N];
    say("\n\n==================== %s ====================\n", name);
    for (src = 0; src < N; src++) {
        algo(src, dist, pred);
        print_header(src);
        for (dst = 0; dst < N; dst++) {
            if (dst == src) continue;
            print_target(src, dst, dist[dst]);
            if (dist[dst] < INF) print_paths_by_pred(pred, src, dst, 0);
        }
    }
}

static void run_floyd(void)
{
    static int d[N][N];
    static Mask next[N][N];
    int src, dst;

    say("\n\n==================== Floyd-Warshall ====================\n");
    print_matrix("Floyd 실행 전", cost);
    floyd_warshall(d, next);
    print_matrix("Floyd 실행 후", d);

    for (src = 0; src < N; src++) {
        print_header(src);
        for (dst = 0; dst < N; dst++) {
            if (dst == src) continue;
            print_target(src, dst, d[src][dst]);
            if (d[src][dst] < INF) print_paths_by_next(next, src, dst, 0);
        }
    }
}

int main(int argc, char *argv[])
{
    int all_one = (argc > 1 && strcmp(argv[1], "1") == 0);

#ifdef _WIN32
    SetConsoleOutputCP(CP_UTF8); /* 한글 깨짐 방지 */
#endif
    out = fopen(all_one ? "result_all_one.txt" : "result.txt", "w");
    if (!out) fprintf(stderr, "결과 파일을 만들 수 없어 화면에만 출력합니다.\n");

    build_graph(all_one);
    say("그래프: 그림 2 (%s)\n", all_one ? "모든 거리 = 1" : "주어진 거리");

    run_single_source("Bellman-Ford", bellman_ford);
    run_single_source("Dijkstra", dijkstra);
    run_floyd();

    if (out) fclose(out);
    return 0;
}
