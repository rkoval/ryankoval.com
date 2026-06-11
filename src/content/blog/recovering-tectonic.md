At work, we're utilizing Tectonic to bootstrap our Kubernetes cluster for running some of our infrastructure.

As running a self-hosted Kubernetes is a decently garguantuan beast, you are likely to encounter hiccups as you are learning the tool. This post is largely just a braindump of what I had to do to recover our cluster's control plane after it had crashed from a manual configuration change. Hopefully, it is useful to somebody in dire need of aid.

Before you start, you will likely want to use a terminal that can echo keyboard output to multiple panes at once to avoid repetition. iTerm 2 (macOS only) and tmux can both do this.

1. `ssh` to all master nodes:

   ```bash
   ssh -A -i path/to/your/key core@your-ip
   ```

   - you must have `-A` to forward your key to other boxes that we will `ssh` to
   - which key to use and `your-ip` can be found on the EC2 dashboard within AWS

2. Follow _Cleaning up Kubernetes resources_ from the [Tectonic troubleshooting guide](https://coreos.com/tectonic/docs/latest/troubleshooting/bootkube_recovery_tool.html#cleaning-up-kubernetes-resources)

3. `ssh` to an etcd server from the master

   - Must be done from a master because the default security groups will only allow entry from another etcd node or a master node

4. Run `ps auxf | grep etcd` and copy the full path to `tls.zip`

5. Back on the master node, `scp core@your-etcd-ip:/path/to/tls.zip .`

   - These certs likely exist on the master node itself, but I wasn't sure which ones to actually use, as there were many

6. Unzip the TLS certs to a directory and `cd` into it

7. Download [`bootkube`](https://github.com/kubernetes-incubator/bootkube/releases)

8. Run:

   ```bash
   ./bootkube recover \
       --recovery-dir=recovered \
       --etcd-servers=https://your-etcd-0:2379,https://your-etcd-1:2379,https://your-etcd-2:2379 \
       --kubeconfig=/etc/kubernetes/kubeconfig \
       --etcd-ca-path=ca.crt \
       --etcd-certificate-path=peer.crt \
       --etcd-private-key-path=peer.key
   ```

   - This command was copied from [the Tectonic troubleshooting guide](https://coreos.com/tectonic/docs/latest/troubleshooting/bootkube_recovery_tool.html#recovery-with-an-external-etcd-cluster), so feel free to reference it if something has changed with your version

**If this failure is a direct cause of config that was changed manually**, make any adjustments or reverts to the manifests in `recovered/bootstrap-manifests`. Then, run:

```bash
./bootkube start --asset-dir=recovered
```

**If this failure was a direct cause of modifying API server config**, you will have a small window to correct this via the tectonic console or `kubectl` while the bootstrap API server is crash-looping
